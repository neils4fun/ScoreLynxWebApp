export interface Hole {
  number: number;
  par: number;
  matchPlayHandicap: number;
}

export interface CourseTee {
  teeID: string;
  name: string;
  slope: number;
  rating: number;
  holes: Hole[];
}

export interface Course {
  courseID: string;
  name: string;
  city: string;
  state: string;
  region: string;
  tees: CourseTee[];
}

export interface CourseResponse {
  status: {
    code: number;
    message: string;
  };
  course: Course;
}