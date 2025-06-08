/*
To allow students to find suitable tutors based on:
Subject
Availability
Language preference
Education level (if required)
*/

//  TutorFinder
import User from "../models/Users.js"

/**
 * 
 * @param {Array} req.body.subjects - Array of subjects
 * @param {String} req.body.availability - day and time in string
 * @param {Array} req.body.languages - Array of languages
 * @param {*} res 
 */

export const MatchTutors=async(req,res)=>{
     try {
        // TODO:add education_level
    const { subjects, availability, languages } = req.body; // student preferences

     const tutors = await User.find({ role: 'tutor' }).select('-password');

    const scoredTutors = tutors.map(tutor => {
      let score = 0;

      // Subject match: +2 for each match
      const commonSubjects = tutor.subjects.filter(subject => subjects.includes(subject));
      score += commonSubjects.length * 2;

      // Availability match: +1 for each match
      const commonAvailability = tutor.availability.filter(slot => availability.includes(slot));
      score += commonAvailability.length;

      // Language match: +1 for each match
      const commonLanguages = tutor.languages.filter(lang => languages.includes(lang));
      score += commonLanguages.length;

      // Rating boost (scaled, e.g., 0–5): +rating * 1.5
      score += (tutor.rating || 0) * 1.5;

      // Sessions boost: +1 if sessionsCompleted > 10
      if (tutor.sessionsCompleted > 10) score += 1;

      return { tutor, score };
    });

    // Sort by score descending
    scoredTutors.sort((a, b) => b.score - a.score);

    // Return only tutor data
    const sortedTutors = scoredTutors.map(item => item.tutor);

    res.status(200).json(sortedTutors);
  } catch (err) {
    res.status(500).json({ msg: 'Error matching tutors', error: err.message });
  }
}


/*** @param {String} req.query.subject - subject wise filter */
export const FilterbySubject=async(req,res)=>{
    try {
        const { subject } = req.query;
        if (!subject) {
      return res.status(400).json({ msg: 'Subject query parameter is required' });
         }

    const tutors = await User.find({
      role: 'tutor',
      subjects: { $in: [subject] }
    }).select('-password');
        res.status(200).json(tutors);
    } catch (error) {
         res.status(500).json({ msg: 'Error Filtering by Subject', error: error.message });   
    }
}

export const getTutor=async(req,res)=>{
  try {
     const tutors=await User.find({
      role:'tutor'
     }).select('-password');
     res.status(200).json(tutors);
  } catch (error) {
         res.status(500).json({ msg: 'Error in getting tutor', error: error.message });   
  }
}


