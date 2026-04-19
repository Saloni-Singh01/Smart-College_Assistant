// data/mockData.js

export const timetableData = {
  Monday:    [ { time:'8:00–9:00',  subject:'Data Structures',   room:'CS-101', faculty:'Dr. Sharma' }, { time:'9:00–10:00',  subject:'Mathematics III',   room:'LH-04',  faculty:'Prof. Gupta' }, { time:'10:15–11:15', subject:'Operating Systems',    room:'CS-101', faculty:'Dr. Mehta'  }, { time:'11:15–12:15', subject:'Computer Networks',  room:'CS-102', faculty:'Prof. Singh' }, { time:'1:00–3:00', subject:'DS Lab',               room:'Lab-3',  faculty:'Dr. Sharma'  } ],
  Tuesday:   [ { time:'8:00–9:00',  subject:'Computer Networks', room:'CS-102', faculty:'Prof. Singh' }, { time:'9:00–10:00',  subject:'Data Structures',   room:'CS-101', faculty:'Dr. Sharma' }, { time:'10:15–11:15', subject:'Mathematics III',      room:'LH-04',  faculty:'Prof. Gupta' }, { time:'11:15–12:15', subject:'Elective',            room:'LH-06',  faculty:'Prof. Kumar' }, { time:'1:00–3:00', subject:'OS Lab',               room:'Lab-1',  faculty:'Dr. Mehta'   } ],
  Wednesday: [ { time:'8:00–9:00',  subject:'Operating Systems', room:'CS-101', faculty:'Dr. Mehta'  }, { time:'9:00–10:00',  subject:'Data Structures',   room:'CS-101', faculty:'Dr. Sharma' }, { time:'10:15–11:15', subject:'Elective',            room:'LH-06',  faculty:'Prof. Kumar' }, { time:'11:15–12:15', subject:'Mathematics III',    room:'LH-04',  faculty:'Prof. Gupta' }, { time:'1:00–3:00', subject:'Library / Self Study', room:'Library',faculty:'—'           } ],
  Thursday:  [ { time:'8:00–9:00',  subject:'Mathematics III',   room:'LH-04',  faculty:'Prof. Gupta' }, { time:'9:00–10:00',  subject:'Computer Networks', room:'CS-102', faculty:'Prof. Singh' }, { time:'10:15–11:15', subject:'Data Structures',    room:'CS-101', faculty:'Dr. Sharma'  }, { time:'11:15–12:15', subject:'Operating Systems',  room:'CS-101', faculty:'Dr. Mehta'   }, { time:'1:00–3:00', subject:'Networks Lab',         room:'Lab-2',  faculty:'Prof. Singh' } ],
  Friday:    [ { time:'8:00–9:00',  subject:'Elective',          room:'LH-06',  faculty:'Prof. Kumar' }, { time:'9:00–10:00',  subject:'Operating Systems', room:'CS-101', faculty:'Dr. Mehta'  }, { time:'10:15–11:15', subject:'Computer Networks',  room:'CS-102', faculty:'Prof. Singh' }, { time:'11:15–12:15', subject:'Data Structures',    room:'CS-101', faculty:'Dr. Sharma'  }, { time:'1:00–3:00', subject:'Project Work',         room:'Lab-4',  faculty:'Dr. Sharma'  } ],
};

export const subjectColors = {
  'Data Structures':'#ff5c35','Mathematics III':'#2563eb','Operating Systems':'#059669',
  'Computer Networks':'#7c3aed','DS Lab':'#ff8c6b','OS Lab':'#34d399',
  'Networks Lab':'#a78bfa','Elective':'#d97706','Project Work':'#ec4899',
  'Library / Self Study':'#9aa0b4',
};
