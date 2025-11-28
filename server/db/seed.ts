import { db } from ".";
import {
  surveys,
  questions,
  questionOptions,
  users,
  responses,
  answers,
} from "./schema";
import { hash } from "bcrypt-ts-edge";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create demo users
  const hashedPassword = await hash("password123", 10);

  const [user1] = await db
    .insert(users)
    .values([
      {
        email: "john@example.com",
        password: hashedPassword,
        name: "John Doe",
      },
      {
        email: "jane@example.com",
        password: hashedPassword,
        name: "Jane Smith",
      },
    ])
    .returning();

  console.log("✅ Created users");

  // Create surveys
  const [survey1, survey2] = await db
    .insert(surveys)
    .values([
      {
        title: "Customer Satisfaction Survey",
        description: "Help us improve our services by sharing your feedback",
      },
      {
        title: "Product Feedback Form",
        description: "Tell us what you think about our latest product release",
      },
    ])
    .returning();

  console.log("✅ Created surveys");

  // Create questions for survey 1
  const [q1, q2, q3, q4] = await db
    .insert(questions)
    .values([
      {
        surveyId: survey1.id,
        title: "How satisfied are you with our service?",
        description: "Rate your overall experience",
        required: true,
        type: "select",
        order: 1,
      },
      {
        surveyId: survey1.id,
        title: "What could we improve?",
        description: "Your suggestions help us grow",
        required: false,
        type: "textarea",
        order: 2,
      },
      {
        surveyId: survey1.id,
        title: "Would you recommend us to others?",
        description: null,
        required: true,
        type: "select",
        order: 3,
      },
      {
        surveyId: survey1.id,
        title: "Any additional comments?",
        description: "Share any other thoughts",
        required: false,
        type: "textarea",
        order: 4,
      },
    ])
    .returning();

  console.log("✅ Created questions for survey 1");

  // Create options for select questions
  await db.insert(questionOptions).values([
    // Question 1 options
    {
      questionId: q1.id,
      label: "Very Satisfied",
      value: "very_satisfied",
      order: 1,
    },
    { questionId: q1.id, label: "Satisfied", value: "satisfied", order: 2 },
    { questionId: q1.id, label: "Neutral", value: "neutral", order: 3 },
    {
      questionId: q1.id,
      label: "Dissatisfied",
      value: "dissatisfied",
      order: 4,
    },
    {
      questionId: q1.id,
      label: "Very Dissatisfied",
      value: "very_dissatisfied",
      order: 5,
    },

    // Question 3 options
    { questionId: q3.id, label: "Definitely", value: "definitely", order: 1 },
    { questionId: q3.id, label: "Probably", value: "probably", order: 2 },
    { questionId: q3.id, label: "Not Sure", value: "not_sure", order: 3 },
    {
      questionId: q3.id,
      label: "Probably Not",
      value: "probably_not",
      order: 4,
    },
    {
      questionId: q3.id,
      label: "Definitely Not",
      value: "definitely_not",
      order: 5,
    },
  ]);

  console.log("✅ Created question options");

  // Create questions for survey 2
  const [q5, q6] = await db
    .insert(questions)
    .values([
      {
        surveyId: survey2.id,
        title: "Which features do you use most?",
        description: null,
        required: true,
        type: "select",
        order: 1,
      },
      {
        surveyId: survey2.id,
        title: "How intuitive is the interface?",
        description: "Rate from 1-5",
        required: true,
        type: "select",
        order: 2,
      },
      {
        surveyId: survey2.id,
        title: "What features would you like to see?",
        description: "Describe your ideal features",
        required: false,
        type: "textarea",
        order: 3,
      },
    ])
    .returning();

  await db.insert(questionOptions).values([
    // Question 5 options
    { questionId: q5.id, label: "Dashboard", value: "dashboard", order: 1 },
    { questionId: q5.id, label: "Analytics", value: "analytics", order: 2 },
    { questionId: q5.id, label: "Reports", value: "reports", order: 3 },
    { questionId: q5.id, label: "Settings", value: "settings", order: 4 },

    // Question 6 options
    { questionId: q6.id, label: "5 - Very Intuitive", value: "5", order: 1 },
    { questionId: q6.id, label: "4 - Intuitive", value: "4", order: 2 },
    { questionId: q6.id, label: "3 - Neutral", value: "3", order: 3 },
    { questionId: q6.id, label: "2 - Confusing", value: "2", order: 4 },
    { questionId: q6.id, label: "1 - Very Confusing", value: "1", order: 5 },
  ]);

  console.log("✅ Created questions for survey 2");

  // Create sample responses
  const [response1] = await db
    .insert(responses)
    .values([
      {
        userId: user1.id,
        surveyId: survey1.id,
      },
    ])
    .returning();

  await db.insert(answers).values([
    {
      responseId: response1.id,
      questionId: q1.id,
      value: "very_satisfied",
    },
    {
      responseId: response1.id,
      questionId: q2.id,
      value:
        "The support team could respond faster, but overall great service!",
    },
    {
      responseId: response1.id,
      questionId: q3.id,
      value: "definitely",
    },
    {
      responseId: response1.id,
      questionId: q4.id,
      value: "Keep up the good work!",
    },
  ]);

  console.log("✅ Created sample responses");
  console.log("🎉 Seeding complete!");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
