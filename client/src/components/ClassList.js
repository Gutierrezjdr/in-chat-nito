import React from "react";
import Button from 'react-bootstrap/Button';

// used for inline styling below -- specifically for jsx
let styles = {
    margin: '10px',
  };

//displays courses from "/courses"
function ClassList(props) { 
	return (
	
		 <div class = "course-title">
			<h4>Here are the courses you are enrolled in: </h4>

			<div className = "courses_sec">
				{props.courses.map(course=>{
					return <Button className="courses_btn" onClick={() => { props.switchToChat(); props.handleRoomClick(course.courseID) }} key={course.courseID} >{course.courseName}</Button>
				})}
			</div>
		 </div>
	);
  }


export default ClassList;
