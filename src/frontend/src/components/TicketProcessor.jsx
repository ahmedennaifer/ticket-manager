import React, { useState, useEffect } from 'react';
import { Loader2, Send, CheckCircle, User, Briefcase, Award, Code, Ticket, AlertTriangle } from 'lucide-react';

const TicketProcessor = () => {
  const [ticket, setTicket] = useState('');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showInterface, setShowInterface] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [assigningTicket, setAssigningTicket] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  useEffect(() => {
    // Animation on component mount
    setTimeout(() => setPageLoaded(true), 500);
  }, []);

  const handleSubmit = async () => {
    if (!ticket.trim()) {
      setError('Please enter a ticket description');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setEmployee(null);

    try {
      // The API endpoint URL - adjust if your backend is at a different location
      const apiUrl = 'http://localhost:8000/process_ticket/';

      // Make the API call to the FastAPI backend
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticket: ticket }),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();

      // Update the state with the employee data from the API
      setEmployee(data);
      setSuccess(true);
    } catch (err) {
      console.error('Error processing ticket:', err);
      setError(err.message || 'An error occurred while processing the ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTicket = async () => {
    if (!employee) return;

    setAssigningTicket(true);
    setError('');

    try {
      // Call the assign_ticket endpoint
      const response = await fetch('http://localhost:8000/assign_ticket/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: employee.id,
          name: employee.name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to assign ticket: ${response.status}`);
      }

      const data = await response.json();

      if (data.is_assigned) {
        // Update the employee's ticket count
        setEmployee(prev => ({
          ...prev,
          tickets: data.ticket_count
        }));
        setAssignmentSuccess(true);

        // Reset success message after 3 seconds
        setTimeout(() => {
          setAssignmentSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error assigning ticket:', err);
      setError(`Failed to assign ticket: ${err.message}`);
    } finally {
      setAssigningTicket(false);
    }
  };

  // Decorative elements for background
  const FloatingOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="orb orb-4"></div>
      <div className="orb orb-5"></div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden relative transition-all duration-1000 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <FloatingOrbs />

      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      <div className="absolute inset-0 bg-dots opacity-30"></div>

      <div className="relative z-10">
        {!showInterface ? (
          // Landing Page
          <div className={`min-h-screen flex flex-col justify-center items-center text-center p-6 transition-all duration-700 ${pageLoaded ? 'transform-none' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 animate-pulse-slow">
              TicketFlow AI
            </h1>

            <p className="text-xl md:text-2xl text-white max-w-2xl mb-10 leading-relaxed">
              Revolutionizing ticket assignment with cutting-edge AI matching technology
            </p>

            <div className="relative mb-16">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 animate-pulse"></div>
              <button
                onClick={() => setShowInterface(true)}
                className="relative px-8 py-4 bg-white bg-opacity-10 backdrop-blur-xl rounded-xl text-white font-semibold text-lg shadow-xl hover:shadow-pink-500/20 transition-all duration-300 border border-white border-opacity-20 hover:border-opacity-40"
              >
                Get Started
                <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent transform translate-y-1 animate-line-move"></span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {['Intelligent Matching', 'Real-time Processing', 'Advanced Analytics'].map((feature, index) => (
                <div
                  key={index}
                  className="feature-card bg-white bg-opacity-5 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-10 hover:border-opacity-30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mb-4 mx-auto">
                    <div className="text-white text-xl">{index + 1}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature}</h3>
                  <p className="text-blue-100 text-opacity-80">Cutting-edge technology that transforms your workflow experience.</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Ticket Processing Interface
          <div className="container max-w-5xl mx-auto px-6 py-12 transition-all duration-700">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-text-glow">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  TicketFlow AI
                </span>
              </h1>
              <p className="text-blue-200 text-xl max-w-2xl mx-auto leading-relaxed">
                Our intelligent system will match your ticket to the perfect specialist
              </p>
            </header>

            <div className="glassmorphism rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl border border-white border-opacity-20 relative transform transition-all duration-500 hover:shadow-purple-500/30">
              <div className="p-8">
                <div className="mb-8 relative">
                  <label htmlFor="ticket" className="block text-lg font-medium text-white mb-2 ml-1">
                    Describe Your Issue
                  </label>
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-gradient-x"></div>
                    <textarea
                      id="ticket"
                      rows="5"
                      className="relative w-full px-6 py-4 bg-black bg-opacity-50 text-white rounded-xl border border-white border-opacity-20 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 resize-none"
                      placeholder="Describe your technical issue in detail..."
                      value={ticket}
                      onChange={(e) => setTicket(e.target.value)}
                      disabled={loading}
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="group relative px-8 py-4 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:opacity-70"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                    <span className="relative flex items-center">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5 animate-bounce-subtle" />
                          Find Expert Match
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-900 bg-opacity-50 border border-red-500 text-red-100 rounded-xl animate-fade-in">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  </div>
                )}
              </div>

              {loading && (
                <div className="border-t border-white border-opacity-10 p-8 bg-black bg-opacity-30 animate-fade-in">
                  <div className="flex flex-col items-center justify-center">
                    <div className="loading-ring mb-6">
                      <div></div><div></div><div></div><div></div>
                    </div>
                    <p className="text-blue-200 font-medium text-lg mb-4">Analyzing ticket complexity & finding optimal expert match...</p>
                    <div className="w-full max-w-md h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="fancy-progress-bar h-full rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}

              {employee && success && (
                <div className="border-t border-white border-opacity-10 p-8 bg-black bg-opacity-30 animate-fade-in">
                  <div className="flex items-center justify-center mb-6">
                    <div className="pulse-ring">
                      <CheckCircle className="h-10 w-10 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white ml-3">Perfect Match Found</h2>
                  </div>

                  <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20 hover:border-opacity-40 transition-all duration-500 transform hover:scale-[1.01] hover:shadow-xl shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-blue-900 to-purple-900 p-5 rounded-full">
                          <User className="h-14 w-14 text-blue-200" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{employee.name}</h3>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="employee-stat">
                            <Briefcase className="h-5 w-5 text-blue-400" />
                            <span className="ml-2 text-white">{employee.job}</span>
                          </div>

                          <div className="employee-stat">
                            <Award className="h-5 w-5 text-purple-400" />
                            <span className="ml-2 text-white">{employee.seniority}</span>
                          </div>

                          <div className="employee-stat">
                            <Code className="h-5 w-5 text-blue-400" />
                            <span className="ml-2 text-white">
                              {employee.skills.split(' ').map((skill, i) => (
                                <span key={i} className="skill-tag">{skill}</span>
                              ))}
                            </span>
                          </div>

                          <div className="employee-stat">
                            <Ticket className="h-5 w-5 text-purple-400" />
                            <span className="ml-2 text-white">{employee.tickets} active ticket{employee.tickets !== 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center">
                          <button
                            onClick={handleAssignTicket}
                            disabled={assigningTicket}
                            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:shadow-purple-500/50 transition-all duration-300 text-sm font-medium flex items-center"
                          >
                            {assigningTicket ? (
                              <>
                                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                Assigning...
                              </>
                            ) : (
                              'Assign Ticket Now'
                            )}
                          </button>

                          {assignmentSuccess && (
                            <span className="ml-3 text-green-400 text-sm flex items-center animate-fade-in">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Ticket assigned successfully!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add this at the end to include all the custom styling */}
      <style jsx>{`
        .glassmorphism {
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(16px);
        }
        
        .bg-grid {
          background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .bg-dots {
          background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }
        
        .orb-1 {
          top: -200px;
          left: -100px;
          width: 600px;
          height: 600px;
          background: rgba(138, 43, 226, 0.2);
          animation: float 14s ease-in-out infinite alternate;
        }
        
        .orb-2 {
          bottom: -300px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: rgba(25, 118, 210, 0.2);
          animation: float 18s ease-in-out infinite alternate-reverse;
        }
        
        .orb-3 {
          top: 40%;
          left: 25%;
          width: 300px;
          height: 300px;
          background: rgba(236, 64, 122, 0.15);
          animation: float 16s ease-in-out infinite;
        }
        
        .orb-4 {
          top: 10%;
          right: 15%;
          width: 400px;
          height: 400px;
          background: rgba(121, 80, 242, 0.15);
          animation: float 20s ease-in-out infinite alternate;
        }
        
        .orb-5 {
          bottom: 20%;
          left: 15%;
          width: 350px;
          height: 350px;
          background: rgba(66, 165, 245, 0.15);
          animation: float 22s ease-in-out infinite alternate-reverse;
        }
        
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-40px, 40px) rotate(180deg); }
          100% { transform: translate(40px, -40px) rotate(360deg); }
        }
        
        @keyframes line-move {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 30px rgba(192, 132, 252, 0.2); }
          50% { text-shadow: 0 0 30px rgba(192, 132, 252, 0.6); }
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 100%;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .feature-card {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .loading-ring {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
        }
        
        .loading-ring div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: 64px;
          height: 64px;
          margin: 8px;
          border: 6px solid #fff;
          border-radius: 50%;
          animation: loading-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: #a855f7 transparent transparent transparent;
        }
        
        .loading-ring div:nth-child(1) {
          animation-delay: -0.45s;
        }
        
        .loading-ring div:nth-child(2) {
          animation-delay: -0.3s;
        }
        
        .loading-ring div:nth-child(3) {
          animation-delay: -0.15s;
        }
        
        @keyframes loading-ring {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .fancy-progress-bar {
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
          animation: gradient 2s ease infinite;
          width: 100%;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; width: 10%; }
          50% { background-position: 100% 50%; width: 70%; }
          100% { background-position: 0% 50%; width: 90%; }
        }
        
        .pulse-ring {
          position: relative;
        }
        
        .pulse-ring::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(74, 222, 128, 0.6);
          animation: pulse-ring 2s infinite;
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 1; }
          70% { transform: scale(1.2); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        
        .employee-stat {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s;
        }
        
        .employee-stat:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .skill-tag {
          display: inline-block;
          margin-right: 4px;
          background: rgba(96, 165, 250, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.85em;
        }
      `}</style>
    </div>
  );
};

export default TicketProcessor;
