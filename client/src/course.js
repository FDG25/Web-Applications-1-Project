/**
 * Constructor function for new Course objects
 * @param {string} code
 * @param {string} name
 * @param {number} credits
 * @param {number} max_students 
 * @param {string} preparatory_course
 * @param {number} no_stds
 * @param {string} incompat
 */

function Course(code, name, credits, max_students, preparatory_course, no_stds, incompat) {
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.max_students = max_students;
    this.preparatory_course = preparatory_course;
    this.no_stds = no_stds;
    this.incompat = incompat;
}

/**
 * Create a new empty transcript object (a list of Course objects)
 */
function CourseList() {
    this.courseList = [];

    /**
     * Add a new course to the library
     * @param {Course} course the course to be added
     */
    this.add = (course) => {
        this.courseList.push(course);
    };

    this.find = (code) => {
        const result = this.courseList.filter((course)=>course.code===code);
        return result.length ? result[0] : undefined;
    };
}


export {Course, CourseList};