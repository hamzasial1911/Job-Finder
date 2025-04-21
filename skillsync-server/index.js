const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const OpenAI = require('openai');
require("dotenv").config();

const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

// Serve static files from React build
const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));

// Database connection string and MongoDB client setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@skillsync.wa51l.mongodb.net/?retryWrites=true&w=majority&appName=SkillSync`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Multer configuration for handling file uploads (for job applications)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Ensure the uploads folder is publicly accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files from the "uploads" directory

// Add OpenAI configuration after your MongoDB configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure to add this to your .env file
});

// Main function to run the MongoDB operations and API setup
async function run() {
  try {
    await client.connect();

    const db = client.db("skillsyncportal");
    const jobsCollections = db.collection("jobs");
    const usersCollections = db.collection("users");
    const applicationsCollections = db.collection("applications");
    const testResultsCollection = db.collection("testResults");

    // API Route for user login (authentication)
    app.post("/user-login", async (req, res) => {
      const { email, password } = req.body;
      const user = await usersCollections.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .send({ message: "User not found", status: false });
      }

      if (user.password !== password) {
        return res
          .status(401)
          .send({ message: "Invalid password", status: false });
      }

      res.status(200).send({
        message: "Login successful",
        status: true,
        user: { username: user.username, email: user.email, role: user.role },
      });
    });

    // API Route for user signup (registration)
    app.post("/user-signup", async (req, res) => {
      const body = req.body;
      body.createAt = new Date();
      const result = await usersCollections.insertOne(body);

      if (result.insertedId) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: "Cannot Insert, Try Again later!",
          status: false,
        });
      }
    });

    // API Route to post a new job (posting a job)
    app.post("/post-job", async (req, res) => {
      const body = req.body;
      body.createAt = new Date();
      const result = await jobsCollections.insertOne(body);

      if (result.insertedId) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: "Cannot Insert, Try Again later!",
          status: false,
        });
      }
    });

    // API Route to get all jobs
    app.get("/all-jobs", async (req, res) => {
      const jobs = await jobsCollections.find({}).toArray();
      res.send(jobs);
    });

    // API Route to get a specific job by its ID
    app.get("/all-jobs/:id", async (req, res) => {
      const id = req.params.id;
      const job = await jobsCollections.findOne({ _id: new ObjectId(id) });
      res.send(job);
    });

    // API Route to get jobs posted by a specific email
    app.get("/MyJobs/:email", async (req, res) => {
      const jobs = await jobsCollections
        .find({ postedby: req.params.email })
        .toArray();
      res.status(200).send(jobs);
    });

    // **DELETE API Route for deleting a job**
    app.delete("/job/:id", async (req, res) => {
      const id = req.params.id;
      const result = await jobsCollections.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        res.status(404).send({ message: "Job not found" });
      } else {
        res.status(200).send({ message: "Job deleted successfully" });
      }
    });

    // API Route to update job information
    app.patch("/update-job/:id", async (req, res) => {
      const id = req.params.id;
      const jobData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { ...jobData } };
      const options = { upsert: true };
      const result = await jobsCollections.updateOne(
        filter,
        updateDoc,
        options
      ); // Update the job
      res.send(result);
    });

    const { ObjectId } = require("mongodb");

    // POST route to apply for a job
    app.post("/apply-job", upload.single("resume"), async (req, res) => {
      const { jobId, email } = req.body;

      if (!req.file) {
        return res.status(400).send({ message: "No resume uploaded" });
      }

      // Find the user by email to retrieve the userId
      const user = await usersCollections.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .send({ message: "User not found with the provided email" });
      }

      const userId = user._id;

      // Create the application object
      const application = {
        jobId,
        userId: userId,
        email,
        resumePath: `/uploads/${req.file.filename}`,
        appliedAt: new Date(),
      };

      try {
        // Insert the application into the applications collection
        const result = await applicationsCollections.insertOne(application);

        if (result.insertedId) {
          return res
            .status(200)
            .send({ message: "Application submitted successfully" });
        } else {
          return res
            .status(500)
            .send({ message: "Failed to submit application" });
        }
      } catch (error) {
        console.error("Error while submitting application:", error);
        return res
          .status(500)
          .send({
            message: "An error occurred while submitting the application",
          });
      }
    });

    // GET route to retrieve applicants for a specific job
    app.get("/applications/:jobId", async (req, res) => {
      const { jobId } = req.params;

      try {
        // Fetch applications for the given jobId
        const applications = await applicationsCollections
          .find({ jobId })
          .toArray();

        if (applications.length === 0) {
          return res
            .status(404)
            .send({ message: "No applications found for this job" });
        }

        const applicantDetails = await Promise.all(
          applications.map(async (application) => {
            const user = await usersCollections.findOne({
              _id: new ObjectId(application.userId),
            });

            return {
              ...application,
              user: user
                ? { username: user.username, email: user.email }
                : null,
            };
          })
        );


        res.status(200).send(applicantDetails);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        res
          .status(500)
          .send({ message: "An error occurred while fetching applicants" });
      }
    });

    // API Route to fetch jobs applied for by a specific email
    app.get("/my-applications/:email", async (req, res) => {
      const { email } = req.params;

      try {
        // Fetch applications by the email
        const applications = await applicationsCollections
          .find({ email })
          .toArray();

        if (applications.length === 0) {
          return res
            .status(404)
            .send({ message: "No applications found for this email" });
        }

        // Populate job details for each application
        const jobs = await Promise.all(
          applications.map(async (application) => {
            const job = await jobsCollections.findOne({
              _id: new ObjectId(application.jobId),
            });
            return {
              ...application,
              jobDetails: job
                ? {
                  title: job.jobTitle,
                  company: job.companyName,
                  postedBy: job.postedby,
                }
                : null,
            };
          })
        );

        res.status(200).send(jobs);
      } catch (error) {
        console.error("Error fetching applications:", error);
        res
          .status(500)
          .send({ message: "An error occurred while fetching applications" });
      }
    });

    // Add this new API Route for changing password
    app.post("/change-password", async (req, res) => {
      const { email, newPassword } = req.body;

      try {
        // Find the user by email
        const user = await usersCollections.findOne({ email });

        if (!user) {
          return res.status(404).json({
            status: false,
            message: "User not found"
          });
        }

        // Update the user's password
        const result = await usersCollections.updateOne(
          { email },
          { $set: { password: newPassword } }
        );

        if (result.modifiedCount === 1) {
          res.status(200).json({
            status: true,
            message: "Password updated successfully"
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Password update failed"
          });
        }
      } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({
          status: false,
          message: "An error occurred while updating the password"
        });
      }
    });

    // Modify the generate-test endpoint to store the complete test data
    app.post("/generate-test", async (req, res) => {
      const { jobId, jobTitle, jobDescription } = req.body;

      try {
        const prompt = `Create 10 multiple choice questions for a ${jobTitle} position.
        The questions should test technical knowledge relevant to the role.
        Job description: ${jobDescription}
        
        Return ONLY a JSON array of objects, where each object has:
        - question: the question text
        - options: array of 4 possible answers
        - correctAnswer: the correct answer (must be one of the options)
        
        The response should be valid JSON without any markdown formatting or additional text.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a technical interviewer creating job assessment questions. Respond only with valid JSON."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        });

        let responseText = completion.choices[0].message.content;

        // Clean up the response text
        responseText = responseText.trim();
        if (responseText.startsWith('```json')) {
          responseText = responseText.replace(/```json\n|```/g, '');
        } else if (responseText.startsWith('```')) {
          responseText = responseText.replace(/```\n|```/g, '');
        }

        // Parse and validate questions
        let questions = JSON.parse(responseText);

        if (!Array.isArray(questions)) {
          throw new Error('Response is not an array of questions');
        }

        // Store the complete test data in MongoDB
        const testData = {
          jobId: new ObjectId(jobId),
          jobTitle,
          questions: questions,
          createdAt: new Date(),
          results: []
        };

        await testResultsCollection.insertOne(testData);

        // Remove correct answers before sending to frontend
        const questionsForFrontend = questions.map(({ question, options }) => ({
          question,
          options
        }));

        res.json({ questions: questionsForFrontend });
      } catch (error) {
        console.error('Error generating test:', error);
        res.status(500).json({ error: 'Failed to generate test questions', details: error.message });
      }
    });

    // Modify the evaluate-test endpoint
    app.post("/evaluate-test", async (req, res) => {
      const { jobId, userId, answers, questions } = req.body;

      try {
        // Enhanced evaluation prompt for OpenAI
        const evaluationPrompt = `
    You are a technical interviewer evaluating a candidate's test responses for a job position.
    Evaluate each answer and provide constructive feedback.
    
    Questions and Answers to evaluate:
    ${questions.map((q, index) => `
    Question ${index + 1}: ${q.question}
    Available options: ${q.options.join(', ')}
    Candidate's answer: ${answers[index]}
    `).join('\n')}
    
    Please provide:
    1. A score out of 100
    2. Identify the top 2-3 areas where the candidate needs improvement
    3. For each improvement area, provide specific, actionable learning suggestions
    4. A brief encouraging message
    
    Return the response as a JSON object with this structure:
    {
      "score": number,
      "improvementAreas": [
        {
          "area": "string",
          "suggestions": ["string"]
        }
      ],
      "encouragingMessage": "string",
      "detailedFeedback": ["string"] // for recruiter view only
    }`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an expert technical interviewer who provides constructive, encouraging feedback while being honest about areas of improvement."
            },
            {
              role: "user",
              content: evaluationPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        });

        let evaluationResult;
        try {
          evaluationResult = JSON.parse(completion.choices[0].message.content);
        } catch (error) {
          throw new Error('Failed to parse OpenAI evaluation response');
        }

        // Store complete results (for recruiter's view)
        await testResultsCollection.updateOne(
          { jobId: new ObjectId(jobId) },
          {
            $push: {
              results: {
                userId,
                answers,
                score: evaluationResult.score,
                improvementAreas: evaluationResult.improvementAreas,
                detailedFeedback: evaluationResult.detailedFeedback,
                encouragingMessage: evaluationResult.encouragingMessage,
                submittedAt: new Date()
              }
            }
          },
          { upsert: true }
        );

        // Send focused response to employee
        res.json({
          score: evaluationResult.score,
          passed: evaluationResult.score >= 70,
          improvementAreas: evaluationResult.improvementAreas,
          encouragingMessage: evaluationResult.encouragingMessage
        });

      } catch (error) {
        console.error('Error evaluating test:', error);
        res.status(500).json({
          error: 'Failed to evaluate test',
          message: error.message
        });
      }
    });
    // Add an endpoint to get test results for recruiters
    app.get("/test-results/:jobId", async (req, res) => {
      const { jobId } = req.params;

      try {
        const testResults = await testResultsCollection
          .findOne({ jobId });

        if (!testResults) {
          return res.status(404).json({ error: 'No test results found for this job' });
        }

        res.json(testResults);
      } catch (error) {
        console.error('Error fetching test results:', error);
        res.status(500).json({ error: 'Failed to fetch test results' });
      }
    });

    app.get("*", (req, res) => {
      res.sendFile(path.join(buildPath, "index.html"));
    });

    console.log("Connected to MongoDB!");
  } finally {

  }
}

run().catch(console.dir);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
