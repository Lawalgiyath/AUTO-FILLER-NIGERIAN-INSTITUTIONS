const XLSX = require('xlsx');
const path = require('path');

// Sample data
const staffData = [
  {
    Title: 'Prof',
    Surname: 'Adeyemi',
    FirstName: 'Oluwaseun',
    MiddleName: 'Babatunde',
    Email: 'o.adeyemi@unilag.edu.ng',
    Faculty: 'Faculty of Science',
    Department: 'Computer Science',
    Rank: 'Professor',
    EmploymentStatus: 'Full Time'
  },
  {
    Title: 'Dr',
    Surname: 'Okonkwo',
    FirstName: 'Chioma',
    MiddleName: 'Ngozi',
    Email: 'c.okonkwo@unilag.edu.ng',
    Faculty: 'Faculty of Engineering',
    Department: 'Electrical Engineering',
    Rank: 'Senior Lecturer',
    EmploymentStatus: 'Full Time'
  },
  {
    Title: 'Assoc. Prof',
    Surname: 'Ibrahim',
    FirstName: 'Yusuf',
    MiddleName: 'Mohammed',
    Email: 'y.ibrahim@unilag.edu.ng',
    Faculty: 'Faculty of Arts',
    Department: 'History',
    Rank: 'Associate Professor',
    EmploymentStatus: 'Full Time'
  },
  {
    Title: 'Dr',
    Surname: 'Adeleke',
    FirstName: 'Folake',
    MiddleName: 'Oluwakemi',
    Email: 'f.adeleke@unilag.edu.ng',
    Faculty: 'Faculty of Science',
    Department: 'Chemistry',
    Rank: 'Lecturer I',
    EmploymentStatus: 'Full Time'
  },
  {
    Title: 'Mr',
    Surname: 'Eze',
    FirstName: 'Chukwuemeka',
    MiddleName: 'Obinna',
    Email: 'c.eze@unilag.edu.ng',
    Faculty: 'Faculty of Social Sciences',
    Department: 'Economics',
    Rank: 'Lecturer II',
    EmploymentStatus: 'Contract'
  },
  {
    Title: 'Mrs',
    Surname: 'Balogun',
    FirstName: 'Aisha',
    MiddleName: 'Omowunmi',
    Email: 'a.balogun@unilag.edu.ng',
    Faculty: 'Faculty of Education',
    Department: 'Educational Management',
    Rank: 'Senior Lecturer',
    EmploymentStatus: 'Full Time'
  },
  {
    Title: 'Dr',
    Surname: 'Nwosu',
    FirstName: 'Kenechukwu',
    MiddleName: 'Ikenna',
    Email: 'k.nwosu@unilag.edu.ng',
    Faculty: 'Faculty of Law',
    Department: 'Private Law',
    Rank: 'Lecturer I',
    EmploymentStatus: 'Full Time'
  },
  {
    Title: 'Prof',
    Surname: 'Oladele',
    FirstName: 'Titilayo',
    MiddleName: 'Adeola',
    Email: 't.oladele@unilag.edu.ng',
    Faculty: 'Faculty of Environmental Sciences',
    Department: 'Architecture',
    Rank: 'Professor',
    EmploymentStatus: 'Full Time'
  },
  {
    Title: 'Dr',
    Surname: 'Mustapha',
    FirstName: 'Zainab',
    MiddleName: 'Khadija',
    Email: 'z.mustapha@unilag.edu.ng',
    Faculty: 'Faculty of Pharmacy',
    Department: 'Clinical Pharmacy',
    Rank: 'Senior Lecturer',
    EmploymentStatus: 'Full Time'
  },
  {
    Title: 'Ms',
    Surname: 'Okoro',
    FirstName: 'Ifunanya',
    MiddleName: 'Chidinma',
    Email: 'i.okoro@unilag.edu.ng',
    Faculty: 'Faculty of Management Sciences',
    Department: 'Accounting',
    Rank: 'Assistant Lecturer',
    EmploymentStatus: 'Part Time'
  }
];

// Create workbook
const workbook = XLSX.utils.book_new();

// Convert data to worksheet
const worksheet = XLSX.utils.json_to_sheet(staffData);

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Staff Data');

// Write file
const outputPath = path.join(__dirname, '..', 'data', 'sample-staff.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log('Excel file created successfully:', outputPath);
