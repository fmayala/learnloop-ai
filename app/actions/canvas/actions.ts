'use server'
// TODO: READ TOKEN FROM ACCCOUNT ON JWT NEXT AUTH, REFRESH IF EXPIRED
import { auth } from '@/auth'
import { CQuizOptions, CQuizQuestionOptions, RCourse } from '@/app/actions/canvas/types'
import { db } from '@/auth'
import { checkQuizLimits, handleTokenRefresh } from './utils';
import { addQuizQuestions, createClassicQuiz, fetchCourses } from './api';
import { getUserRecord, updateQuizUsage } from '../auth/actions-user';
import { getAccount } from '../auth/actions-integrations';

// Canvas API
// TODO: READ TOKEN FROM ACCCOUNT ON JWT NEXT AUTH, REFRESH IF EXPIRED
// Main function to get courses
export async function getCourses(page: number, per_page: number): Promise<RCourse[] | any> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const account = (await db
    .selectFrom('Account')
    .selectAll()
    .where('userId', '=', session.user.id)
    .where('provider', '=', 'canvas')
    .executeTakeFirst());

  if (!account) {
    return { error: 'Account not found' };
  }

  try {
    const refreshedAccount = await handleTokenRefresh(account);
    const coursesData = await fetchCourses(refreshedAccount.access_token!, page, per_page);
    return coursesData;
  } catch (error: any) {
    console.error('Error:', error);
    return { error: error.message || 'Failed to process request' };
  }
}

export async function publishQuizToCanvas(
  selectedCourse: string,
  quizOptions: string,
  quizData: string
) {
  try {
    const user = await getUserRecord();

    if (!user) {
      throw new Error('User not found');
    }

    const account = await getAccount(user.id);
    checkQuizLimits(user);
    const refreshedAccount = await handleTokenRefresh(account);
    const course = JSON.parse(selectedCourse) as RCourse;
    const options = JSON.parse(quizOptions) as CQuizOptions;
    const data = JSON.parse(quizData) as CQuizQuestionOptions[];

    if (!options || !data) {
      throw new Error('Invalid quiz options or data');
    }

    const quizId = await createClassicQuiz(refreshedAccount, course.id.toString(), options);
    await addQuizQuestions(refreshedAccount, course.id.toString(), quizId, data);
    await updateQuizUsage(user.id, user.published_quiz_usage as number);

    return { success: true, quizId: quizId };
  } catch (error: any) {
    console.error('Error:', error);
    return {
      error: error.message || 'Failed to process request'
    };
  }
}