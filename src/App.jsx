import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- DUMMY DATA --- //
const dummyData = {
  students: [
    { id: 1, name: 'Ram', progress: 75, modulesCompleted: 3, drills: 2 },
    { id: 2, name: 'Shivam', progress: 90, modulesCompleted: 4, drills: 3 },
    { id: 3, name: 'Ankit', progress: 40, modulesCompleted: 2, drills: 1 },
    { id: 4, name: 'Rohit', progress: 60, modulesCompleted: 3, drills: 1 },
  ],
  modules: [
    { id: 1, title: 'Earthquake Safety', description: 'Learn how to stay safe during an earthquake.', progress: 100, icon: 'Earthquake' },
    { id: 2, title: 'Fire Drill Procedures', description: 'Essential steps for a safe fire evacuation.', progress: 60, icon: 'Fire' },
    { id: 3, title: 'Flood Preparedness', description: 'How to prepare for and act during a flood.', progress: 25, icon: 'Flood' },
    { id: 4, title: 'First Aid Basics', description: 'Introduction to basic first aid techniques.', progress: 0, icon: 'FirstAid' },
  ],
  studentProfile: {
    name: 'Aman',
    badges: ['Earthquake Ready', 'Fire Safety Certified', 'First Aid Aware'],
    points: 1250,
    upcomingQuizzes: [
      { module: 'Flood Preparedness', date: 'Oct 15, 2025' },
      { module: 'First Aid Basics', date: 'Oct 22, 2025' },
    ],
  },
  adminDashboard: {
    trainingCompletion: [
      { name: 'Earthquake', completion: 92 },
      { name: 'Fire Drill', completion: 78 },
      { name: 'Flood', completion: 45 },
      { name: 'First Aid', completion: 32 },
    ],
    drillParticipation: [
      { name: 'Q1 Drills', participation: 85 },
      { name: 'Q2 Drills', participation: 91 },
      { name: 'Q3 Drills', participation: 76 },
      { name: 'Q4 Drills', participation: 88 },
    ],
    preparednessScores: [
      { name: 'Students', value: 400 },
      { name: 'Teachers', value: 300 },
      { name: 'Staff', value: 150 },
    ],
    overallStats: {
        totalUsers: 452,
        modulesCompleted: 1230,
        preparednessScore: 8.2
    }
  },
};

// --- ICONS (as React Components) --- //
// Using inline SVGs to avoid dependencies. Sourced from lucide-react.
const icons = {
    Home: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    ),
    BookOpen: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
    ),
    ShieldAlert: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
    ),
    Users: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    BarChart: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>
    ),
    LogOut: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
    ),
    Award: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
    ),
    ClipboardList: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
    ),
    CheckCircle: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    ),
    ChevronRight: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>
    ),
    // Emergency specific icons
    Earthquake: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m2 8 2 2-2 2 2 2-2 2"/><path d="m6 4 2 2-2 2 2 2-2 2 2 2"/><path d="m22 16-2-2 2-2-2-2 2-2"/><path d="m18 20-2-2 2-2-2-2 2-2-2-2"/><path d="M10 12h4"/></svg>),
    Fire: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 0 1 2.5 8.24"/><path d="M12 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/></svg>),
    Flood: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 7V3H6v4"/><path d="M18 12.7V9H6v3.7c0 1.5 1.1 2.8 2.5 2.8s2.5-1.3 2.5-2.8c0 1.5 1.1 2.8 2.5 2.8s2.5-1.3 2.5-2.8z"/><path d="M12 21v-3.5c-2.2 0-4-1.8-4-4"/><path d="M12 21v-3.5c2.2 0 4-1.8 4-4"/></svg>),
    FirstAid: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/><path d="M12 11v4"/><path d="M10 13h4"/></svg>),
};

const getModuleIcon = (iconName) => {
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8"/> : null;
};


// --- CUSTOM UI COMPONENTS (ShadCN/UI inspired) --- //
const Card = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className = '' }) => (
    <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>
        {children}
    </div>
);

const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

const Button = ({ children, onClick, className = '', variant = 'default' }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900';
    const variants = {
        default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline: 'border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-gray-500',
        ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-gray-500',
    };
    return <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>{children}</button>
};

const ProgressBar = ({ value, className = '' }) => (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 ${className}`}>
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
);

const Badge = ({ children, className = '' }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 ${className}`}>
        {children}
    </span>
);


// --- PAGE COMPONENTS --- //

const LoginPage = ({ onLogin }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
        >
            <div className="text-center">
                <icons.ShieldAlert className="w-16 h-16 mx-auto text-blue-600" />
                <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Disaster Preparedness</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Please select your role to continue</p>
            </div>
            <div className="flex flex-col space-y-4">
                <Button onClick={() => onLogin('student')} className="w-full py-3 text-lg">
                    <icons.Users className="w-5 h-5 mr-2" /> Student Login
                </Button>
                <Button onClick={() => onLogin('teacher')} className="w-full py-3 text-lg">
                    <icons.BookOpen className="w-5 h-5 mr-2" /> Teacher Login
                </Button>
                <Button onClick={() => onLogin('admin')} className="w-full py-3 text-lg">
                    <icons.BarChart className="w-5 h-5 mr-2" /> Admin Login
                </Button>
            </div>
        </motion.div>
    </div>
);


const StudentDashboard = ({ setPage }) => {
    const { name, badges, points, upcomingQuizzes } = dummyData.studentProfile;
    const totalProgress = dummyData.modules.reduce((acc, m) => acc + m.progress, 0) / dummyData.modules.length;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardContent className="flex items-center space-x-6">
                         <img src={`https://placehold.co/100x100/E2E8F0/4A5568?text=${name.charAt(0)}`} alt="Avatar" className="w-24 h-24 rounded-full" />
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {name}!</h2>
                            <p className="text-gray-600 dark:text-gray-400">You're making great progress. Keep it up!</p>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader><h3 className="text-xl font-semibold">My Progress</h3></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Overall Completion</span>
                            <span className="font-bold text-blue-600">{Math.round(totalProgress)}%</span>
                        </div>
                        <ProgressBar value={totalProgress} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><h3 className="text-xl font-semibold">Quick Access to Modules</h3></CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                       {dummyData.modules.slice(0, 4).map(module => (
                           <div key={module.id} className="p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center space-x-4 cursor-pointer" onClick={() => setPage('modules')}>
                               <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600">
                                   {getModuleIcon(module.icon)}
                               </div>
                               <div>
                                   <h4 className="font-semibold">{module.title}</h4>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">{module.progress}% complete</p>
                               </div>
                               <icons.ChevronRight className="w-5 h-5 ml-auto text-gray-400"/>
                           </div>
                       ))}
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                 <Card>
                    <CardHeader><h3 className="text-xl font-semibold">Badges & Points</h3></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center mb-4 text-4xl font-bold text-blue-600">
                           <icons.Award className="w-10 h-10 mr-2"/> {points}
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {badges.map(badge => <Badge key={badge}>{badge}</Badge>)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><h3 className="text-xl font-semibold">Upcoming Quizzes</h3></CardHeader>
                    <CardContent>
                       <ul className="space-y-4">
                           {upcomingQuizzes.map(quiz => (
                               <li key={quiz.module} className="flex items-center justify-between">
                                   <div>
                                       <p className="font-semibold">{quiz.module}</p>
                                       <p className="text-sm text-gray-500 dark:text-gray-400">{quiz.date}</p>
                                   </div>
                                   <Button variant="outline" className="px-3 py-1">View</Button>
                               </li>
                           ))}
                       </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const TeacherDashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teacher Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/50 text-blue-600">
                            <icons.Users className="w-8 h-8"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                            <p className="text-2xl font-bold">{dummyData.students.length}</p>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900/50 text-green-600">
                            <icons.CheckCircle className="w-8 h-8"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Progress</p>
                            <p className="text-2xl font-bold">66%</p>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="flex items-center space-x-4">
                        <div className="p-3 bg-yellow-100 rounded-lg dark:bg-yellow-900/50 text-yellow-600">
                            <icons.ClipboardList className="w-8 h-8"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Drill Readiness</p>
                            <p className="text-2xl font-bold">High</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Student Progress</h3>
                    <Button>Assign Module</Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-gray-700">
                                <tr>
                                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Student</th>
                                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Progress</th>
                                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Modules</th>
                                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Drills</th>
                                    <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dummyData.students.map(student => (
                                    <tr key={student.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="py-3 px-4 font-medium">{student.name}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <ProgressBar value={student.progress} className="w-24 mr-2"/>
                                                <span>{student.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{student.modulesCompleted}</td>
                                        <td className="py-3 px-4">{student.drills}</td>
                                        <td className="py-3 px-4">
                                            <Button variant="outline" className="px-3 py-1 text-xs">View Details</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const AdminDashboard = () => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const { overallStats } = dummyData.adminDashboard;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Analytics</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                     <CardContent className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/50 text-blue-600"><icons.Users className="w-8 h-8"/></div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                            <p className="text-2xl font-bold">{overallStats.totalUsers}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                     <CardContent className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900/50 text-green-600"><icons.CheckCircle className="w-8 h-8"/></div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Modules Completed</p>
                            <p className="text-2xl font-bold">{overallStats.modulesCompleted}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                     <CardContent className="flex items-center space-x-4">
                        <div className="p-3 bg-yellow-100 rounded-lg dark:bg-yellow-900/50 text-yellow-600"><icons.ShieldAlert className="w-8 h-8"/></div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Preparedness Score</p>
                            <p className="text-2xl font-bold">{overallStats.preparednessScore} / 10</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader><h3 className="text-xl font-semibold">Training Completion (%)</h3></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dummyData.adminDashboard.trainingCompletion} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)"/>
                                <XAxis dataKey="name" stroke="currentColor" fontSize={12}/>
                                <YAxis stroke="currentColor" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: 'black', border: 'none', borderRadius: '10px' }} />
                                <Legend />
                                <Bar dataKey="completion" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader><h3 className="text-xl font-semibold">Preparedness by Role</h3></CardHeader>
                    <CardContent>
                         <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={dummyData.adminDashboard.preparednessScores}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {dummyData.adminDashboard.preparednessScores.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                 <Tooltip contentStyle={{ backgroundColor: 'black', border: 'none', borderRadius: '10px' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const LearningModulesPage = () => {
    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Modules</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {dummyData.modules.map(module => (
                     <Card key={module.id} className="flex flex-col">
                         <CardHeader>
                             <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600">
                                   {getModuleIcon(module.icon)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{module.title}</h3>
                                </div>
                             </div>
                         </CardHeader>
                         <CardContent className="flex-grow">
                             <p className="text-gray-600 dark:text-gray-400">{module.description}</p>
                         </CardContent>
                         <div className="p-6 border-t dark:border-gray-700">
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
                                <span className="text-sm font-semibold">{module.progress}%</span>
                             </div>
                             <ProgressBar value={module.progress}/>
                             <Button className="w-full mt-4">
                                {module.progress === 100 ? 'Review Module' : 'Continue Learning'}
                             </Button>
                         </div>
                     </Card>
                 ))}
             </div>
        </div>
    );
};

const EmergencyResponsePage = () => {
    const procedures = [
        { 
            type: "Earthquake", 
            title: "DROP, COVER, AND HOLD ON",
            steps: ["DROP to your hands and knees.", "COVER your head and neck under a sturdy table or desk.", "HOLD ON to your shelter until the shaking stops."],
            color: "bg-yellow-100 dark:bg-yellow-900/50 border-yellow-500 text-yellow-800 dark:text-yellow-200",
            icon: <icons.Earthquake className="w-16 h-16"/>,
        },
        { 
            type: "Fire", 
            title: "EVACUATE IMMEDIATELY",
            steps: ["Stay calm and walk to the nearest exit.", "Feel doors for heat before opening.", "Stay low to the ground to avoid smoke."],
            color: "bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-200",
            icon: <icons.Fire className="w-16 h-16"/>,
        },
        { 
            type: "Flood", 
            title: "GET TO HIGHER GROUND",
            steps: ["Move immediately to higher ground.", "Do not walk, swim, or drive through flood waters.", "Listen to emergency broadcast information."],
            color: "bg-blue-100 dark:bg-blue-900/50 border-blue-500 text-blue-800 dark:text-blue-200",
            icon: <icons.Flood className="w-16 h-16"/>,
        },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white">Emergency Response</h1>
            <p className="text-center text-lg text-gray-600 dark:text-gray-400">Follow these critical steps in an emergency. Stay calm and act quickly.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {procedures.map(proc => (
                    <div key={proc.type} className={`border-l-4 rounded-2xl p-8 shadow-lg ${proc.color}`}>
                        <div className="flex items-center space-x-6 mb-6">
                            {proc.icon}
                            <h2 className="text-3xl font-bold">{proc.title}</h2>
                        </div>
                        <ol className="list-decimal list-inside space-y-4 text-lg">
                            {proc.steps.map((step, index) => <li key={index}>{step}</li>)}
                        </ol>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- App Layout & Main Component --- //

const Sidebar = ({ role, page, setPage, onLogout }) => {
    const navItems = {
        student: [
            { name: 'Dashboard', icon: 'Home', page: 'dashboard' },
            { name: 'Modules', icon: 'BookOpen', page: 'modules' },
            { name: 'Emergency', icon: 'ShieldAlert', page: 'emergency' },
        ],
        teacher: [
            { name: 'Dashboard', icon: 'Home', page: 'dashboard' },
            { name: 'Students', icon: 'Users', page: 'students' }, // Placeholder
            { name: 'Modules', icon: 'BookOpen', page: 'modules' },
            { name: 'Emergency', icon: 'ShieldAlert', page: 'emergency' },
        ],
        admin: [
            { name: 'Dashboard', icon: 'BarChart', page: 'dashboard' },
            { name: 'Users', icon: 'Users', page: 'users' }, // Placeholder
            { name: 'Modules', icon: 'BookOpen', page: 'modules' },
            { name: 'Emergency', icon: 'ShieldAlert', page: 'emergency' },
        ],
    };

    const currentNav = navItems[role] || [];
    
    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col p-4">
            <div className="flex items-center space-x-2 p-4 border-b dark:border-gray-700 mb-4">
                <icons.ShieldAlert className="w-10 h-10 text-blue-600"/>
                <span className="text-xl font-bold">PrepSystem</span>
            </div>
            <nav className="flex-grow">
                {currentNav.map(item => {
                    const Icon = icons[item.icon];
                    const isActive = page === item.page;
                    return (
                        <a
                            href="#"
                            key={item.name}
                            onClick={() => setPage(item.page)}
                            className={`flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            <Icon className="w-6 h-6 mr-3" />
                            <span>{item.name}</span>
                        </a>
                    );
                })}
            </nav>
            <div>
                 <a href="#" onClick={onLogout} className="flex items-center px-4 py-3 my-1 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <icons.LogOut className="w-6 h-6 mr-3"/>
                    <span>Logout</span>
                </a>
            </div>
        </aside>
    );
}

const PageContent = ({ page, role, setPage }) => {
    let Component;
    switch(page){
        case 'dashboard':
            if (role === 'student') Component = StudentDashboard;
            else if (role === 'teacher') Component = TeacherDashboard;
            else Component = AdminDashboard;
            break;
        case 'modules':
            Component = LearningModulesPage;
            break;
        case 'emergency':
            Component = EmergencyResponsePage;
            break;
        default:
            if (role === 'student') Component = StudentDashboard;
            else if (role === 'teacher') Component = TeacherDashboard;
            else Component = AdminDashboard;
    }
    
    return (
        <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <Component setPage={setPage} />
        </motion.div>
    );
};


export default function App() {
    const [userRole, setUserRole] = useState(null);
    const [page, setPage] = useState('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if(isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);
    
    const handleLogin = (role) => {
        setUserRole(role);
        setPage('dashboard');
    };

    const handleLogout = () => {
        setUserRole(null);
    };

    if (!userRole) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Sidebar role={userRole} page={page} setPage={setPage} onLogout={handleLogout} />
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {/* Dark mode toggle for demonstration */}
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    {isDarkMode ? '☀' : '🌙'}
                </button>
                <AnimatePresence mode="wait">
                    <PageContent page={page} role={userRole} setPage={setPage} />
                </AnimatePresence>
            </main>
        </div>
    );
}