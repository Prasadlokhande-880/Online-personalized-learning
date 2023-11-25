const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const sign_student = require("./model/modelstudent");
const sign_teachers= require('./model/modeltecher');
const video = require("./model/modelvideo");


const app = express();
const port = 4200;
require('./mongo.jsx/mongoDBcont');

app.use(bodyParser.json());


// this is the function for the launchpad
app.get("/launchpad",async(req,res)=>{

    try{
        let data= [
            {
                title: 'Career Caching',
                description: "You'll work one-on-one with a Career Coach to set you on the right path and provide the job search support you need to succeed."
            },
            {
                title: 'Unique Resume',
                description: 'We develop a future-oriented career branding document that tells your story and prepares you for a successful future.'
            },
            {
                title: 'LinkedIn Profile',
                description: 'We create for you a strong online, branded message to set you apart, get you noticed & found for the right opportunities.'
            }
        ]
        res.json(data);
        console.log("data is send to the frountend:");
    }
    catch(e){
        console.log("error",e);
    }
})
// this is the code

app.get("/Allcourses1",async(req,res)=>{
    try{
        const data = [
            {
                Title: "Web Development Fundamentals",
                Starting: "October 15",
                Name: "Emma Thompson",
                sub_tital: "Full Stack Developer",
                Info: "Learn the essential skills to kickstart your journey in web development. This course covers HTML, CSS, and JavaScript, along with hands-on projects to build real-world applications.",
                URL: "https://img.freepik.com/free-photo/closeup-portrait-caucasian-happy-teacher-glasses_74855-9736.jpg?w=2000",
                classname: "block web-development"
            },
            {
                Title: "AI and Machine Learning Basics",
                Starting: "November 5",
                Name: "Alex Rodriguez",
                sub_tital: "AI Specialist",
                Info: "Explore the fundamentals of Artificial Intelligence and Machine Learning. Understand key concepts, algorithms, and applications in AI, and gain practical experience through coding exercises.",
                URL: "https://img.freepik.com/premium-photo/portrait-young-happy-smiling-teacher-student-man-standing-near-chalkboard-background_160360-1055.jpg",
                classname: "block ai-ml"
            },
            {
                Title: "Cloud Computing Essentials",
                Starting: "December 1",
                Name: "Sophie Chang",
                sub_tital: "Cloud Architect",
                Info: "Dive into the world of cloud computing and learn about popular cloud platforms. This course covers cloud services, deployment models, and best practices for scalable and secure cloud solutions.",
                URL: "https://img.freepik.com/premium-photo/young-teacher-student-draw-triangle-blackboard-with-formula_160360-1059.jpg",
                classname: "block cloud-computing"
            },
            {
                Title: "DevOps for Developers",
                Starting: "January 10",
                Name: "Michael Patel",
                sub_tital: "DevOps Engineer",
                Info: "Gain insights into DevOps practices and methodologies. Understand the collaboration between development and operations teams, automate workflows, and improve the efficiency of software delivery.",
                URL: "https://img.freepik.com/premium-photo/successful-mature-teacher-professor-smart-casualwear-holding-piece-chalk-while-standing-by-blackboard-front-camera-classroom_274679-18823.jpg",
                classname: "block devops"
            }
        ];

        res.json(data);
        console.log("User registered successfully");
    }
    catch(e){
        console.log("there is an error:",e);
    }
})


app.get("/Allcourses2",async(req,res)=>{
    try{
        const data = [
            {
                Title: "Data Science for Executives",
                Starting: "October 1",
                Name: "Eleanor Harper",
                sub_tital: "Data Science Leader",
                Info: "Empower yourself with the knowledge of data science essentials. This course is tailored for executives, providing insights into data-driven decision-making, machine learning applications, and strategic data management.",
                URL: "https://img.freepik.com/free-photo/young-attractive-dark-haired-man-glasses-is-standing-near-whiteboard-he-wears-blue-shirt-dark-jacket-he-got-luck-with-job_197531-563.jpg",
                classname: "block executive"
            },
            {
                Title: "Innovative Marketing Strategies",
                Starting: "November 15",
                Name: "Oliver Turner",
                sub_tital: "Marketing Innovator",
                Info: "Explore cutting-edge marketing strategies and trends. This course goes beyond traditional marketing approaches, focusing on digital marketing, social media campaigns, and data-driven marketing insights.",
                URL: "https://img.freepik.com/free-photo/successful-financier_1098-16015.jpg",
                classname: "block marketing"
            },
            {
                Title: "Leadership in Technology",
                Starting: "December 10",
                Name: "Aisha Patel",
                sub_tital: "Tech Leadership Expert",
                Info: "Enhance your leadership skills in the rapidly evolving tech industry. This course covers effective leadership strategies, team management in technology-driven environments, and fostering innovation.",
                URL: "https://img.freepik.com/free-photo/young-dark-haired-man-glasses-is-standing-near-whiteboard-office-he-wears-blue-shirt-dark-jacket-he-is-smiling-showing-sign-camera_197531-551.jpg?w=2000",
                classname: "block tech-leadership"
            }
        ];

        res.json(data);
        console.log("User registered successfully");
    }
    catch(e){
        console.log("there is an error:",e);
    }
})



app.get("/Allcourses3",async(req,res)=>{
    try{
        const data = [
            {
                Title: "Cybersecurity for Business Leaders",
                Starting: "October 5",
                Name: "Sophia Reynolds",
                sub_tital: "Cybersecurity Expert",
                Info: "Equip yourself with the knowledge to safeguard your business in the digital age. This course covers essential cybersecurity concepts, threat mitigation strategies, and best practices for protecting sensitive information.",
                URL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc_4mFrJwYnLhi7j6BAFdji6Rz8wBV1-bCAEqF3ICu1xKDaX60XPnQ4yfZYOwwF0Ev9qw&usqp=CAU",
                classname: "block cybersecurity"
            },
            {
                Title: "Strategic Digital Transformation",
                Starting: "November 20",
                Name: "James Mercer",
                sub_tital: "Digital Transformation Specialist",
                Info: "Navigate the digital landscape and lead your organization through successful digital transformation. This course explores key strategies, technologies, and frameworks for effective organizational change.",
                URL: "https://img.freepik.com/premium-photo/english-learn-teacher-classroom-class-studying-speak_488220-84617.jpg?size=626&ext=jpg&ga=GA1.1.1880011253.1699401600&semt=ais",
                classname: "block digital-transformation"
            },
            {
                Title: "Finance for Tech Leaders",
                Starting: "December 15",
                Name: "Lena Mitchell",
                sub_tital: "Financial Analyst",
                Info: "Gain financial literacy tailored for technology leaders. This course covers budgeting, financial planning, and strategies for optimizing financial performance in tech-driven enterprises.",
                URL: "https://www.tutorhunt.com/images/resources/all/width400/all-3047.jpg",
                classname: "block finance-tech"
            }
        ];


        res.json(data);
        console.log("User registered successfully");
    }
    catch(e){
        console.log("there is an error:",e);
    }
})

app.get("/Allcourses4",async(req,res)=>{
    try{
        const data = [
            {
                Title: "Blockchain for Business Leaders",
                Starting: "October 8",
                Name: "Natalie Turner",
                sub_tital: "Blockchain Innovator",
                Info: "Explore the transformative potential of blockchain technology for business. This course delves into blockchain concepts, use cases, and strategies for leveraging blockchain to enhance business processes.",
                URL: "https://www.telegraph.co.uk/multimedia/archive/01379/frustrated_teacher_1379554c.jpg?imwidth=680",
                classname: "block blockchain"
            },
            {
                Title: "Digital Marketing Masterclass",
                Starting: "November 25",
                Name: "Carlos Rodriguez",
                sub_tital: "Digital Marketing Expert",
                Info: "Elevate your digital marketing skills with hands-on exercises and real-world case studies. This masterclass covers advanced digital marketing techniques, analytics, and campaign optimization.",
                URL: "https://i2-prod.mirror.co.uk/incoming/article11908579.ece/ALTERNATES/s615b/Teacher-in-Front-of-Blackboard.jpg",
                classname: "block digital-marketing"
            },
            {
                Title: "Agile Project Management",
                Starting: "December 20",
                Name: "Ella Anderson",
                sub_tital: "Agile Practitioner",
                Info: "Master the principles of Agile project management. This course focuses on Agile methodologies, sprint planning, and collaborative project execution for efficient and adaptable project delivery.",
                URL: "https://i2-prod.mirror.co.uk/incoming/article11908579.ece/ALTERNATES/s615b/Teacher-in-Front-of-Blackboard.jpg",
                classname: "block agile-project-management"
            }
        ];


        res.json(data);
        console.log("User registered successfully");
    }
    catch(e){
        console.log("there is an error:",e);
    }
})


app.get("/Allcourses5",async(req,res)=>{
    try{
        const data = [
            {
                Title: "Data Analytics for Business Leaders",
                Starting: "October 12",
                Name: "Isabella Chen",
                sub_tital: "Data Analytics Strategist",
                Info: "Discover the power of data analytics for informed decision-making. This course covers statistical analysis, data visualization, and practical applications of data analytics in a business context.",
                URL: "https://img.freepik.com/free-photo/side-view-smiley-woman-holding-book_23-2149915886.jpg?size=626&ext=jpg&ga=GA1.1.468057375.1698073894&semt=ais",
                classname: "block data-analytics"
            },
            {
                Title: "UX/UI Design Essentials",
                Starting: "November 30",
                Name: "Gabriel Smith",
                sub_tital: "UX/UI Design Guru",
                Info: "Learn the fundamentals of user experience (UX) and user interface (UI) design. This course emphasizes user-centered design principles, wireframing, and prototyping for effective digital product design.",
                URL: "https://img.freepik.com/free-photo/young-businesswoman-holding-opened-clipboard-with-pencil_114579-47011.jpg?size=626&ext=jpg&ga=GA1.1.468057375.1698073894&semt=ais",
                classname: "block ux-ui-design"
            },
            {
                Title: "IoT for Business Innovation",
                Starting: "December 25",
                Name: "Aiden Taylor",
                sub_tital: "IoT Innovator",
                Info: "Explore the Internet of Things (IoT) and its transformative potential for business. This course covers IoT technologies, applications, and strategies for leveraging IoT in innovative business solutions.",
                URL: "https://img.freepik.com/free-photo/businessman-black-suit-holding-his-tasklist-smiling_114579-18998.jpg?size=626&ext=jpg&ga=GA1.1.468057375.1698073894&semt=ais",
                classname: "block iot-business-innovation"
            }
        ];


        res.json(data);
        console.log("User registered successfully");
    }
    catch(e){
        console.log("there is an error:",e);
    }
})


app.get("/Allcourses6",async(req,res)=>{
    try{
        const data = [
            {
                Title: "Digital Leadership and Innovation",
                Starting: "October 18",
                Name: "Maxine Foster",
                sub_tital: "Digital Leadership Expert",
                Info: "Develop leadership skills in the digital era. This course explores digital leadership strategies, innovation frameworks, and effective ways to lead organizations through technological advancements.",
                URL: "https://img.freepik.com/free-photo/front-view-young-beautiful-lady-white-t-shirt-black-jeans-coat-holding-green-book-white_140725-18660.jpg?size=626&ext=jpg&ga=GA1.1.468057375.1698073894&semt=ais",
                classname: "block digital-leadership"
            },
            {
                Title: "E-commerce Strategies for Success",
                Starting: "December 5",
                Name: "Jordan Carter",
                sub_tital: "E-commerce Specialist",
                Info: "Unlock the secrets to successful e-commerce. This course covers e-commerce trends, customer experience optimization, and strategies for building and growing an online business.",
                URL: "https://img.freepik.com/premium-photo/portrait-handsome-smiling-confident-young-businessman-wearing-suit-standing-isolated-beige-wall-holding-stack-documents_171337-109727.jpg?size=626&ext=jpg&ga=GA1.1.468057375.1698073894&semt=ais",
                classname: "block ecommerce-strategies"
            },
            {
                Title: "Robotic Process Automation (RPA) Fundamentals",
                Starting: "January 1",
                Name: "Harper Nguyen",
                sub_tital: "RPA Enthusiast",
                Info: "Dive into the world of Robotic Process Automation (RPA). This course provides a comprehensive understanding of RPA technologies, implementation best practices, and automation strategies.",
                URL: "https://img.freepik.com/free-photo/young-woman-posing-with-notebook-white-background-high-quality-photo_114579-62463.jpg?size=626&ext=jpg&ga=GA1.1.468057375.1698073894&semt=ais",
                classname: "block rpa-fundamentals"
            }
        ];

        res.json(data);
        console.log("User registered successfully");
    }
    catch(e){
        console.log("there is an error:",e);
    }
})


app.get("/Allcourses7",async(req,res)=>{
    try{
        const data = [
            {
                Title: "Strategic Product Management",
                Starting: "October 22",
                Name: "Aria Thompson",
                sub_tital: "Product Management Expert",
                Info: "Enhance your product management skills strategically. This course covers product development, market analysis, and effective strategies for launching and managing successful products.",
                URL: "https://img.freepik.com/free-photo/front-view-female-student-grey-jacket-yellow-backpack-holding-books-light-blue-wall_140725-46453.jpg?size=626&ext=jpg&ga=GA1.1.468057375.1698073894&semt=ais",
                classname: "block product-management"
            },
            {
                Title: "Cybersecurity for Non-Technical Professionals",
                Starting: "December 10",
                Name: "Victor Ramirez",
                sub_tital: "Cybersecurity Educator",
                Info: "Gain essential cybersecurity knowledge without the technical jargon. This course is designed for non-technical professionals, covering cybersecurity basics, best practices, and risk management.",
                URL: "https://img.freepik.com/free-photo/content-successful-male-manager-using-tablet-looking-camera_1262-14194.jpg?size=626&ext=jpg&ga=GA1.1.468057375.1698073894&semt=ais",
                classname: "block cybersecurity-non-tech"
            },
            {
                Title: "Innovative Project Leadership",
                Starting: "January 5",
                Name: "Zara Patel",
                sub_tital: "Project Leadership Specialist",
                Info: "Become an innovative project leader. This course focuses on leadership strategies, project innovation, and effective collaboration for successful project outcomes.",
                URL: "https://img.freepik.com/free-photo/good-looking-business-woman-with-arms-crossed_23-2147626300.jpg?size=626&ext=jpg&ga=GA1.1.468057375.1698073894&semt=ais",
                classname: "block innovative-project-leadership"
            }
        ];

        res.json(data);
        console.log("User registered successfully");
    }
    catch(e){
        console.log("there is an error:",e);
    }
})



// this is the code for the ALL

app.get("/ALL",async(req,res)=>{
    try{
        const data = [
    {
        Title: "Digital Strategy for Business Growth",
        Starting: "October 28",
        Name: "Evan Reynolds",
        sub_tital: "Digital Strategy Consultant",
        Info: "Explore effective digital strategies for business growth. This course covers digital transformation, online presence optimization, and strategies to drive business success in the digital landscape.",
        URL: "https://img.freepik.com/premium-photo/indian-students-isolated-white-background_988871-5.jpg?size=626&ext=jpg&ga=GA1.1.468057375.1698073894&semt=ais",
        classname: "block digital-strategy"
    },
    {
        Title: "User-Centric Mobile App Design",
        Starting: "December 15",
        Name: "Mia Turner",
        sub_tital: "Mobile App Design Expert",
        Info: "Master the art of user-centric mobile app design. This course delves into mobile UI/UX principles, usability testing, and design strategies for creating engaging and user-friendly mobile applications.",
        URL: "https://img.freepik.com/free-photo/portrait-teacher-female-holding-book_23-2148915807.jpg?size=626&ext=jpg&ga=GA1.1.468057375.1698073894&semt=ais",
        classname: "block mobile-app-design"
    },
    {
        Title: "Advanced Cloud Solutions Architecture",
        Starting: "January 10",
        Name: "Liam Chang",
        sub_tital: "Cloud Solutions Architect",
        Info: "Deepen your understanding of cloud solutions architecture. This course explores advanced cloud services, architecture design principles, and strategies for optimizing cloud-based solutions.",
        URL: "https://img.freepik.com/free-photo/portrait-female-teacher-holding-notepad-green_140725-149620.jpg?size=626&ext=jpg&ga=GA1.1.468057375.1698073894&semt=ais",
        classname: "block cloud-solutions-architecture"
    }
];

        res.json(data);
        console.log("User registered successfully");
    }
    catch(e){
        console.log("there is an error:",e);
    }
})

app.post('/signup_saving', async (req, res) => {
    try {
        const { name, email, PhoneNumber, password, Country, Profession, Institution, Teams_List, Team_Invites, Discuss_Profile, CodeChef_Pro_Plan } = req.body;

        const student_to_save = new sign_student({
            name,
            email,
            PhoneNumber,
            password,
            Country:"",
            Profession:"",
            Institution:"",
            Teams_List:"",
            Team_Invites:"",
            Discuss_Profile:"",
            CodeChef_Pro_Plan:"",
            URL:""
        });

        await student_to_save.save();

        res.json({ message: "User registered successfully" });
    } catch (e) {
        console.log("error=>", e);
        res.status(500).json({ error: "An error occurred" });
    }
});

// this is the code for the login to the page

let nameoutput;
app.post('/login_save', async (req, res) => {
    try {
        const { name, password } = req.body;
        console.log(name, password);
        const user = await sign_student.findOne({ name });
        if (!user) {
            res.send("User not found");
        }
        console.log(user);
        if (password===user.password) {
            nameoutput=name;
            console.log("Password is correct!");
            res.json({ message: "Login successful" });
        } else {
            console.log("Password is incorrect!");
            res.send("Incorrect password");
        }
    } catch (e) {
        console.log("An error occurred:", e);
        res.status(500).json({ error: "Internal server error" });
    }
});

// this is the function for the front end profile backend code

const getDate = async (req, res) => {
    try {
        const { username, country, profession, institution, teamsList, teamInvites, discussProfile, codeChefProPlan, isEditMode, profilePicture,URL_value } = req.body;

        // Assuming sign_student is a valid model for your student data
        const user = await sign_student.findOne({ name:nameoutput });
        console.log(nameoutput);
        if (user) {
            console.log("User11 found:", user);
            res.json({
                username: user.name,
                country: user.Country,
                email: user.email,
                phoneNo:user.phoneNumber,
                profession: user.Profession,
                institution: user.Institution,
                teamsList: user.Teams_List,
                teamInvites: user.Team_Invites,
                discussProfile: user.Discuss_Profile,
                codeChefProPlan: user.CodeChef_Pro_Plan,
                isEditMode: false,
                profilePicture: "",
                URL_value:user.URL
            });
        } else {
            console.log("User not found");
            res.json({ error: "User not found" });
        }
    } catch (error) {
        console.log("An error occurred:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


app.post("/postFunction", async (req, res) => {
    try {
        const { username, country, profession, institution, teamsList, teamInvites, discussProfile, codeChefProPlan, isEditMode, profilePicture } = req.body;
        const user = await sign_student.findOne({ name: username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await sign_student.findByIdAndUpdate(
            user._id,
            {
                Country: country,
                Profession: profession,
                Institution: institution,
                Teams_List: teamsList,
                Team_Invites: teamInvites,
                Discuss_Profile: discussProfile,
                CodeChef_Pro_Plan: codeChefProPlan,
                isEditMode: isEditMode,
                profilePicture: profilePicture,
            },
            { new: true }
        );

        nameoutput=username;

        if (!updatedUser) {
            return res.status(500).json({ error: "Failed to update user data" });
        }

        console.log("Output:", updatedUser);
        res.json({ message: "Data updated successfully", updatedUser });
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


  app.get("/getDate", getDate);


  app.post("/uploadimg", async (req, res) => {
    try {
        const { username, url } = req.body; // Destructure the request body

        console.log(username,url);

        // Check if the user exists
        const user = await sign_student.findOne({ name: username });

        const updatedUser = await sign_student.findByIdAndUpdate(
            user._id,
            { URL: url },
            { new: true}
        );

        console.log("Data is updated:", updatedUser);

        return res.status(200).json({ message: "User URL updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


// this is the code the teachers


app.post('/teachersignup', async (req, res) => {
    try {
        const {name,branch,Experience,ContactNumber,Email,Password } = req.body;
        console.log(name,branch,Experience,ContactNumber,Email,Password);


        const teachers_save = new sign_teachers({
            name,
            branch,
            Experience,
            ContactNumber,
            Email,
            Password,
            Institution:'',
            Age:0,
            Country:"",
            Country:0,
            city:'',
            URL:'',
        });

        await teachers_save.save();

        res.json({ message: "User registered successfully" });
    } catch (e) {
        console.log("error=>", e);
        res.status(500).json({ error: "An error occurred" });
    }
});


// this is the code for the teacher side login
let teacher;

app.post('/teacherlogin', async (req, res) => {
    try {
        const { username, password } = req.body; // Corrected the field name to 'username'
        console.log(username, password);

        const teacher1 = await sign_teachers.findOne({name : username});
        console.log(teacher1);
        if (!teacher1) {
            console.log("data notfound");
            return res.send("User not found");
        }

        console.log(teacher1);

        if (password === teacher1.Password) { // Assuming 'Password' is the field name in your database
            teacher = username;
            console.log("Password is correct!");
            return res.json({ message: "Login successful" });
        } else {
            console.log("Password is incorrect!");
            return res.send("Incorrect password");
        }
    } catch (e) {
        console.log("An error occurred:", e);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// this is the code for the getdata from the user side

// this is the code for the profile page

const getDatetecher = async (req, res) => {
    try {
        const {name,
            branch,
            Experience,
            ContactNumber,
            Email,
            Password,
            Institution,
            Age,
            Country,
            pincode,
            city,
            URL} = req.body;

        // Assuming sign_student is a valid model for your student data
        const user = await sign_teachers.findOne({ name:teacher });
        console.log(user);
        if (user) {
            console.log("User techer found:", user);
            res.json({
                name:user.name,
                branch:user.branch,
                Experience:user.Experience,
                ContactNumber:user.ContactNumber,
                Email: user.Email,
                Password: user.Password,
                Institution: user.Institution,
                Age:user.Age,
                Country: user.Country,
                pincode: user.pincode,
                city: user.city,
                URL: user.URL,
            });
        } else {
            console.log("User not found");
            res.json({ error: "User not found" });
        }
    } catch (error) {
        console.log("An error occurred:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

app.get("/getDatetecher", getDatetecher);

// this si the code for the handel the updata of the frountend


app.post("/postteacher", async (req, res) => {
    try {
        const {name,
            branch,
            Experience,
            ContactNumber,
            Email,
            Password,
            Institution,
            Age,
            Country,
            pincode,
            city,
            URL } = req.body;
        const user = await sign_teachers.findOne({ name: name });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await sign_teachers.findByIdAndUpdate(
            user._id,
            {   name,
                branch,
                Experience,
                ContactNumber,
                Email,
                Password,
                Institution,
                Age,
                Country,
                pincode,
                city,
                URL
            },
            { new: true }
        );

        teacher=name;

        if (!updatedUser) {
            return res.status(500).json({ error: "Failed to update user data" });
        }

        console.log("Output:", updatedUser);
        res.json({ message: "Data updated successfully", updatedUser });
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// this is the code for uploding the img in the profile page

app.post("/uploadimgtecher", async (req, res) => {
    try {
        const { name, URL } = req.body; // Destructure the request body

        console.log(name, URL);

        // Check if the user exists
        const user = await sign_teachers.findOne({ name: name });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await sign_teachers.findByIdAndUpdate(
            user._id,
            { URL: URL },
            { new: true }
        );

        console.log("Data is updated:", updatedUser);

        return res.status(200).json({ message: "User URL updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


// this is the code for uploding the video and it's descrption
app.post("/videouploding", async (req, res) => {
    try {
      const { videoName,
        videoDescription,
        characterName,
        URLimg,
        URLvideo} = req.body;

      // Assuming 'teacher' is the name of the teacher received in the request body
      const teacher1 = await sign_teachers.findOne({ name: teacher });

      if (!teacher1) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      const id_uploded = teacher1.id;

      const data = {
        videoName,
        videoDescription,
        characterName,
        URLimg,
        URLvideo,
        id_uploded
      };

      const videoInfo = new video(data);
      const savedVideo = await videoInfo.save();

      console.log(savedVideo);

      res.json({ message: "Data is uploaded successfully" });
    } catch (error) {
      console.log("There is an error", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

// this is the code for geting the data from the mongodB

app.get('/getDatevideo', async (req, res) => {
    try {
        const teacher1 = await sign_teachers.findOne({ name: teacher });
        const id_uploded = teacher1.id;
        console.log(id_uploded);
        const data = await video.find({ id_uploded });
        console.log(data);
        res.json(data);
    } catch (error) {
        console.log("Error retrieving video data", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// this is the code for the coures
// Assume 'video' is a mongoose model representing your video collection

app.get('/courses', async (req, res) => {
    try {
        const data = await video.find();
        console.log(data);
        res.json(data);
    } catch (error) {
        console.log("There is an error:", error);
        res.status(500).json({ error: 'Failed to fetch video data' });
    }
});



// this is the function for the logout

app.get("/logout",async=(req,res)=>{
    nameoutput="";
     res.json("logout");
})


app.listen(port, () => {
    console.log("Server is listening on port 4000");
});
