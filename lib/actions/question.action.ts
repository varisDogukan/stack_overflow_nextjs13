"use server";

import { connectToDatabase } from "./../mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import { revalidatePath } from "next/cache";

/**
 * Retrieves a list of questions from the database based on the provided parameters.
 * @param {GetQuestionsParams} params - The parameters for retrieving the questions.
 * @returns {Promise<{ questions: Question[] }>} - A promise that resolves to an object containing the retrieved questions.
 * @throws {Error} - If there is an error retrieving the questions from the database.
 */
export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.log(error);

    throw error;
  }
}

/**
 * Creates a new question with the provided parameters.
 * @param {CreateQuestionParams} params - The parameters for creating the question.
 * @returns {Promise<void>} - A promise that resolves when the question is created.
 * @throws {Error} - If there is an error creating the question.
 */
export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an interaction record for the user's ask_question action

    // Increment author's reputation by +5 for creating a question
    revalidatePath(path);
  } catch (error) {
    //
  }
}
