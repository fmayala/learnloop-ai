// Canvas API types
export interface RCourse {
  id: number
  sis_course_id: string | null
  uuid: string
  integration_id: string | null
  sis_import_id: number | null
  name: string
  course_code: string
  original_name: string | null
  workflow_state: 'unpublished' | 'available' | 'completed' | 'deleted'
  account_id: number
  root_account_id: number
  enrollment_term_id: number
  grading_periods: any | null // Specify further if the structure is known
  grading_standard_id: number | null
  grade_passback_setting: string
  created_at: string
  start_at: string
  end_at: string
  locale: string | null
  enrollments: any[] | null // Specify further if the structure is known
  total_students: number | null
  calendar: any | null // Specify further if the structure is known
  default_view: 'feed' | 'wiki' | 'modules' | 'assignments' | 'syllabus'
  syllabus_body: string | null
  needs_grading_count: number | null
  term: any | null // Specify further if the structure is known
  course_progress: any | null // Specify further if the structure is known
  apply_assignment_group_weights: boolean
  permissions: {
    create_discussion_topic: boolean
    create_announcement: boolean
  } | null
  is_public: boolean
  is_public_to_auth_users: boolean
  public_syllabus: boolean
  public_syllabus_to_auth: boolean
  public_description: string | null
  storage_quota_mb: number
  storage_quota_used_mb: number
  hide_final_grades: boolean
  license: string
  allow_student_assignment_edits: boolean
  allow_wiki_comments: boolean
  allow_student_forum_attachments: boolean
  open_enrollment: boolean
  self_enrollment: boolean
  restrict_enrollments_to_course_dates: boolean
  course_format: string
  access_restricted_by_date: boolean
  time_zone: string
  blueprint: boolean
  blueprint_restrictions: {
    content: boolean
    points: boolean
    due_dates: boolean
    availability_dates: boolean
  } | null
  blueprint_restrictions_by_object_type: {
    assignment: {
      content: boolean
      points: boolean
    }
    wiki_page: {
      content: boolean
    }
  } | null
  template: boolean
}

// Prefix C = Create Quiz
export type CNQuizOptions = {
  quiz: {
    title: string | null
    assignment_group_id: number | null
    points_possible: number | null
    due_at: string | null
    lock_at: string | null
    unlock_at: string | null
    grading_type:
      | 'pass_fail'
      | 'percent'
      | 'letter_grade'
      | 'gpa_scale'
      | 'points'
      | null
    instructions: string | null
    quiz_settings: {
      calculator_type: 'none' | 'basic' | 'scientific' | null
      filter_ip_address: boolean | null
      filters: {
        ips: [string, string][] | null
      }
      multiple_attempts: {
        multiple_attempts_enabled: boolean | null
        attempt_limit: boolean | null
        max_attempts: number | null
        score_to_keep: 'average' | 'first' | 'highest' | 'latest' | null
        cooling_period: boolean | null
        cooling_period_seconds: number | null
      }
      one_at_a_time_type: 'none' | 'question' | null
      allow_backtracking: boolean | null
      result_view_settings: {
        result_view_restricted: boolean | null
        display_points_awarded: boolean | null
        display_points_possible: boolean | null
        display_items: boolean | null
        display_item_response: boolean | null
        display_item_response_correctness: boolean | null
        display_item_correct_answer: boolean | null
        display_item_feedback: boolean | null
      }
      shuffle_answers: boolean | null
      shuffle_questions: boolean | null
      require_student_access_code: boolean | null
      student_access_code: string | null
      has_time_limit: boolean | null
      session_time_limit_in_seconds: number | null
    }
  }
}

export type CNQuizItem = {
  item: {
    position?: number
    points_possible: number
    entry_type: 'Item'
    entry: {
      title?: string
      item_body: string
      calculator_type?: 'none' | 'basic' | 'scientific'
      feedback?: {
        neutral?: string
        correct?: string
        incorrect?: string
      }
      interaction_type_slug:
        | 'multi-answer'
        | 'matching'
        | 'categorization'
        | 'file-upload'
        | 'formula'
        | 'ordering'
        | 'rich-fill-blank'
        | 'hot-spot'
        | 'choice'
        | 'numeric'
        | 'true-false'
        | 'essay'
      interaction_data: {
        word_limit_enabled?: boolean
        // Other interaction data properties based on question type can be added here
      }
      properties?: Record<string, any>
      scoring_data: {
        value?: string
        // Other scoring data properties can be added here
      }
      answer_feedback?: Record<string, string> // Only available for 'choice' question types
      scoring_algorithm: string
    }
  }
}

// Output
type CNQuizMultipleAttemptsSettingsResponse = {
  multiple_attempts_enabled: boolean
  attempt_limit: boolean
  max_attempts?: number
  score_to_keep?: 'average' | 'first' | 'highest' | 'latest'
  cooling_period?: boolean
  cooling_period_seconds?: number
}

type CQuizSettingsResponse = {
  calculator_type: 'none' | 'basic' | 'scientific'
  filter_ip_address: boolean
  filters?: {
    ips: [string, string][]
  }
  one_at_a_time_type: 'none' | 'question'
  allow_backtracking: boolean
  shuffle_answers: boolean
  shuffle_questions: boolean
  require_student_access_code: boolean
  student_access_code?: string
  has_time_limit: boolean
  session_time_limit_in_seconds?: number
  multiple_attempts?: CNQuizMultipleAttemptsSettingsResponse | null
  result_view_settings?: ResultViewSettingsResponse | null
}

type ResultViewSettingsResponse = {
  result_view_restricted: boolean
  display_points_awarded?: boolean
  display_points_possible?: boolean
  display_items?: boolean
  display_item_response?: boolean
  display_item_response_correctness?: boolean
  display_item_correct_answer?: boolean
  display_item_feedback?: boolean
}

export type CNQuizResponse = {
  id: string
  title: string
  instructions: string
  assignment_group_id: string
  points_possible: number
  due_at: string
  lock_at: string | null
  unlock_at: string
  published: boolean
  grading_type:
    | 'pass_fail'
    | 'percent'
    | 'letter_grade'
    | 'gpa_scale'
    | 'points'
  quiz_settings: CQuizSettingsResponse | null
}

// Define the types for request parameters
export interface CQuizOptions {
  quiz: {
    title: string;
    description?: string;
    quiz_type?: 'practice_quiz' | 'assignment' | 'graded_survey' | 'survey';
    assignment_group_id?: number;
    time_limit?: number | null;
    shuffle_answers?: boolean;
    hide_results?: 'always' | 'until_after_last_attempt' | null;
    show_correct_answers?: boolean;
    show_correct_answers_last_attempt?: boolean;
    show_correct_answers_at?: string;
    hide_correct_answers_at?: string;
    allowed_attempts?: number;
    scoring_policy?: 'keep_highest' | 'keep_latest';
    one_question_at_a_time?: boolean;
    cant_go_back?: boolean;
    access_code?: string | null;
    ip_filter?: string | null;
    due_at?: string;
    lock_at?: string;
    unlock_at?: string;
    published?: boolean;
    one_time_results?: boolean;
    only_visible_to_overrides?: boolean;
  };
}

// Define the types for response parameters
export interface CQuizResponse {
  id: number;
  title: string;
  html_url: string;
  mobile_url: string;
  preview_url?: string;
  description: string;
  quiz_type: 'practice_quiz' | 'assignment' | 'graded_survey' | 'survey';
  assignment_group_id: number;
  time_limit: number;
  shuffle_answers: boolean;
  hide_results: 'always' | 'until_after_last_attempt' | null;
  show_correct_answers: boolean;
  show_correct_answers_last_attempt: boolean;
  show_correct_answers_at: string;
  hide_correct_answers_at: string;
  one_time_results: boolean;
  scoring_policy: 'keep_highest' | 'keep_latest';
  allowed_attempts: number;
  one_question_at_a_time: boolean;
  question_count: number;
  points_possible: number;
  cant_go_back: boolean;
  access_code: string;
  ip_filter: string;
  due_at: string;
  lock_at?: string;
  unlock_at: string;
  published: boolean;
  unpublishable: boolean;
  locked_for_user: boolean;
  lock_info?: any;
  lock_explanation?: string;
  speedgrader_url?: string;
  quiz_extensions_url?: string;
  permissions?: any;
  all_dates?: any;
  version_number: number;
  question_types: string[];
  anonymous_submissions: boolean;
}


// Define the types for request parameters
export interface CQuizQuestionOptions {
  question: {
    question_name?: string;
    question_text: string;
    quiz_group_id?: number;
    question_type: 'calculated_question' | 'essay_question' | 'file_upload_question' | 'fill_in_multiple_blanks_question' | 'matching_question' | 'multiple_answers_question' | 'multiple_choice_question' | 'multiple_dropdowns_question' | 'numerical_question' | 'short_answer_question' | 'text_only_question' | 'true_false_question';
    position?: number;
    points_possible?: number;
    correct_comments?: string;
    incorrect_comments?: string;
    neutral_comments?: string;
    text_after_answers?: string;
    answers?: Answer[];
  };
}

// Define the detailed structure for the answers type
export interface Answer {
  id?: number;
  answer_text: string;
  answer_weight: number;
  answer_comments?: string;
  text_after_answers?: string;
  answer_match_left?: string;
  answer_match_right?: string;
  matching_answer_incorrect_matches?: string;
  numerical_answer_type?: 'exact_answer' | 'range_answer' | 'precision_answer';
  exact?: number;
  margin?: number;
  approximate?: number;
  precision?: number;
  start?: number;
  end?: number;
  blank_id?: number;
}


// Define the types for response parameters
export interface CQuizQuestionResponse {
  id: number;
  quiz_id: number;
  position: number;
  question_name: string;
  question_type: 'calculated_question' | 'essay_question' | 'file_upload_question' | 'fill_in_multiple_blanks_question' | 'matching_question' | 'multiple_answers_question' | 'multiple_choice_question' | 'multiple_dropdowns_question' | 'numerical_question' | 'short_answer_question' | 'text_only_question' | 'true_false_question';
  question_text: string;
  points_possible: number;
  correct_comments: string;
  incorrect_comments: string;
  neutral_comments: string;
  answers: Answer[] | null;
}