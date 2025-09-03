import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, MessageCircle, Briefcase, CheckCircle, AlertTriangle, Zap, User, Bot, Send, X } from 'lucide-react';

interface ResumeData {
  fileName: string;
  extractedText: string;
  skills: string[];
  experience: string;
  education: string;
  contact: string;
}

interface Suggestion {
  type: 'improvement' | 'strength' | 'missing';
  category: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

const jobRoles = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Product Manager',
  'UX/UI Designer',
  'DevOps Engineer',
  'Mobile Developer',
  'QA Engineer'
];

function App() {
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: "Hello! I'm here to help you with resume screening and provide guidance. Feel free to ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload -> backend /analyze
  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Analyze request failed');
      const data = await res.json();

      const mapped: ResumeData = {
        fileName: file.name,
        extractedText: data?.analysis ?? 'No analysis returned',
        skills: [],
        experience: '',
        education: '',
        contact: ''
      };

      setResumeData(mapped);
      if (selectedJobRole) {
        generateSuggestions(mapped, selectedJobRole);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to analyze resume. Is the backend running on http://localhost:5000 and CORS enabled?');
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedJobRole]);

  const generateSuggestions = (_data: ResumeData, jobRole: string) => {
    const mockSuggestions: Suggestion[] = [
      { type: 'strength',    category: 'Experience',       message: `Strong ${jobRole.toLowerCase()} background with 5+ years of relevant experience`, priority: 'high' },
      { type: 'strength',    category: 'Technical Skills', message: 'Excellent technical skill set matching the job requirements',                   priority: 'high' },
      { type: 'improvement', category: 'Certifications',    message: 'Consider adding cloud certifications (AWS, Azure) to strengthen your profile', priority: 'medium' },
      { type: 'missing',     category: 'Projects',          message: 'Include specific project examples with quantifiable results',                  priority: 'high' },
      { type: 'improvement', category: 'Keywords',          message: 'Add more industry-specific keywords for ATS optimization',                     priority: 'medium' },
    ];
    setSuggestions(mockSuggestions); // <-- fixed (was calling getSuggestionBg by mistake)
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]); // <-- fixed deps

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulated bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: getBotResponse(userMessage.message),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('resume') && lowerMessage.includes('improve')) {
      return 'To improve your resume, focus on: 1) Adding quantifiable achievements, 2) Using action verbs, 3) Tailoring keywords to the job description, 4) Keeping it concise and well-formatted. Would you like specific advice for any section?';
    }

    if (lowerMessage.includes('ats')) {
      return 'For ATS optimization: Use standard section headings, include relevant keywords from the job posting, use simple formatting, save as PDF, and avoid graphics or unusual fonts. This helps ensure your resume passes through applicant tracking systems.';
    }

    if (lowerMessage.includes('skill') || lowerMessage.includes('technical')) {
      return 'Focus on highlighting skills that match the job requirements. Group them by category (Programming Languages, Frameworks, Tools) and prioritize the most relevant ones. Include your proficiency level when possible.';
    }

    return 'I can help you with resume optimization, ATS tips, skill highlighting, job matching, and interview preparation. What specific aspect would you like to discuss?';
  };

  const getSuggestionIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'strength': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'improvement': return <Zap className="w-5 h-5 text-orange-500" />;
      case 'missing': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getSuggestionBg = (type: Suggestion['type']) => {
    switch (type) {
      case 'strength': return 'bg-emerald-50 border-emerald-200';
      case 'improvement': return 'bg-orange-50 border-orange-200';
      case 'missing': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ResumeAI Screener</h1>
                <p className="text-sm text-gray-600">Intelligent Resume Analysis & Optimization</p>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Upload & Job Role */}
          <div className="space-y-6">
            {/* Job Role Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center space-x-3 mb-4">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Target Job Role</h2>
              </div>

              <select
                value={selectedJobRole}
                onChange={(e) => {
                  const role = e.target.value;
                  setSelectedJobRole(role);
                  if (resumeData) {
                    generateSuggestions(resumeData, role);
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a job role...</option>
                {jobRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Resume</h2>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drop your resume here or click to browse</p>
                <p className="text-sm text-gray-500">PDF files only, max 10MB</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>

            {/* Analysis Status */}
            {isAnalyzing && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="text-blue-900 font-medium">Analyzing Resume...</p>
                    <p className="text-blue-700 text-sm">Extracting text and analyzing content</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center Panel - Resume Data */}
          <div className="space-y-6">
            {resumeData && (
              <>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Extracted Information</h2>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">File Name</h3>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">{resumeData.fileName}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Experience</h3>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded">{resumeData.experience}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Education</h3>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded">{resumeData.education}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Full Extracted Text</h2>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {resumeData.extractedText}
                    </pre>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Suggestions */}
          <div className="space-y-6">
            {suggestions.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Suggestions</h2>

                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${getSuggestionBg(suggestion.type)}`}
                    >
                      <div className="flex items-start space-x-3">
                        {getSuggestionIcon(suggestion.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {suggestion.category}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              suggestion.priority === 'high' 
                                ? 'bg-red-100 text-red-800'
                                : suggestion.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {suggestion.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{suggestion.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Match Score */}
            {resumeData && selectedJobRole && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Match Score</h2>

                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${85 * 3.52} 352`}
                        className="text-emerald-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">85%</span>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Excellent Match</p>
                  <p className="text-sm text-gray-600">
                    Strong alignment with {selectedJobRole} requirements
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg h-96 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Resume Assistant</h3>
                  <p className="text-sm text-gray-600">Ask me anything about resumes!</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`p-2 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your question..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
