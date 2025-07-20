import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Shield, Clock, TrendingUp, Users, BarChart3, AlertCircle, CheckCircle2, Download, Calendar, Mail, ArrowRight, Activity, Database, Search, Zap, Lock, Eye, GitBranch, Briefcase } from 'lucide-react';

// Mock data for visualizations
const timeAllocationData = [
  { category: 'Information Gathering', percentage: 67, color: '#0050A0' },
  { category: 'Analysis & Insights', percentage: 33, color: '#4A90E2' }
];

const caseStudiesData = [
  {
    type: 'Federal Agency',
    title: 'FOIA Response Time',
    metric: '78%',
    description: 'Reduction in response time',
    icon: Clock,
    before: '45 days',
    after: '10 days'
  },
  {
    type: 'State Department', 
    title: 'Issue Tracking',
    metric: '3x',
    description: 'More constituent issues tracked',
    icon: Users,
    before: '~500/month',
    after: '~1,500/month'
  },
  {
    type: 'Municipal Team',
    title: 'Policy Conflicts',
    metric: '91%',
    description: 'Faster identification',
    icon: AlertCircle,
    before: '2 weeks',
    after: '1 day'
  }
];

const riskMatrix = [
  { 
    risk: 'Data Security',
    severity: 'High',
    mitigation: 'On-premise deployment, encrypted storage, access controls',
    icon: Lock
  },
  {
    risk: 'Algorithmic Bias',
    severity: 'Medium', 
    mitigation: 'Regular audits, diverse training data, human oversight',
    icon: Eye
  },
  {
    risk: 'Compliance',
    severity: 'Medium',
    mitigation: 'NIST AI Framework adherence, regular compliance checks',
    icon: Shield
  },
  {
    risk: 'Transparency', 
    severity: 'Low',
    mitigation: 'Explainable AI, audit trails, open documentation',
    icon: GitBranch
  }
];

const roadmapPhases = [
  {
    phase: 1,
    days: '1-30',
    title: 'Foundation',
    tasks: [
      'Select pilot team (5-7 analysts)',
      'Define specific use case',
      'Establish success metrics',
      'Security review'
    ]
  },
  {
    phase: 2,
    days: '31-60',
    title: 'Implementation',
    tasks: [
      'Deploy sandbox environment',
      'Conduct team training',
      'Import test datasets',
      'Initial testing'
    ]
  },
  {
    phase: 3,
    days: '61-90',
    title: 'Optimization',
    tasks: [
      'Run full pilot program',
      'Gather feedback',
      'Measure results',
      'Plan expansion'
    ]
  }
];

// Animated components
const AnimatedCounter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setCount(prev => {
          const increment = Math.ceil(value / 50);
          return prev + increment >= value ? value : prev + increment;
        });
      }, 30);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <span ref={ref} className="font-bold text-5xl">
      {count}{suffix}
    </span>
  );
};

const DonutChart = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const total = data.reduce((sum, item) => sum + item.percentage, 0);
  let cumulativePercentage = 0;

  return (
    <div ref={ref} className="relative w-64 h-64 mx-auto">
      <svg className="transform -rotate-90 w-64 h-64">
        {data.map((item, index) => {
          const startAngle = (cumulativePercentage / total) * 360;
          const endAngle = ((cumulativePercentage + item.percentage) / total) * 360;
          cumulativePercentage += item.percentage;
          
          const startAngleRad = (startAngle * Math.PI) / 180;
          const endAngleRad = (endAngle * Math.PI) / 180;
          
          const x1 = 128 + 80 * Math.cos(startAngleRad);
          const y1 = 128 + 80 * Math.sin(startAngleRad);
          const x2 = 128 + 80 * Math.cos(endAngleRad);
          const y2 = 128 + 80 * Math.sin(endAngleRad);
          
          const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
          
          const pathData = [
            `M 128 128`,
            `L ${x1} ${y1}`,
            `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center shadow-inner">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">Time</div>
            <div className="text-sm text-gray-600">Allocation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      ref={sliderRef}
      className="relative w-full max-w-4xl mx-auto h-96 rounded-lg overflow-hidden cursor-ew-resize select-none"
      onMouseDown={handleMouseDown}
    >
      {/* Before (Manual) */}
      <div className="absolute inset-0 bg-gray-100">
        <div className="p-8 h-full flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Manual Process</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse" />
              <span>Read 500+ pages manually</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse" />
              <span>Take notes in multiple documents</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse" />
              <span>Search through emails and files</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse" />
              <span>Compile findings (2-3 days)</span>
            </div>
          </div>
          <div className="mt-6 text-3xl font-bold text-red-600">⏱️ 2-3 Days</div>
        </div>
      </div>

      {/* After (AI-Assisted) */}
      <div 
        className="absolute inset-0 bg-blue-50"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="p-8 h-full flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-4 text-blue-800">AI-Assisted Process</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span>Upload documents to AI</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span>AI analyzes in seconds</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span>Get structured summaries</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span>Query specific insights</span>
            </div>
          </div>
          <div className="mt-6 text-3xl font-bold text-green-600">⚡ 2 Minutes</div>
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-xl"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
          <ArrowRight className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

const ROICalculator = () => {
  const [analysts, setAnalysts] = useState(10);
  const [hoursWeek, setHoursWeek] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(75);

  const weeklyTimeSaved = hoursWeek * 0.67; // 67% time savings
  const weeklyCostSaved = weeklyTimeSaved * analysts * hourlyRate;
  const annualSaved = weeklyCostSaved * 52;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-blue-900">ROI Calculator</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Policy Analysts
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={analysts}
            onChange={(e) => setAnalysts(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-lg font-semibold text-blue-600">{analysts}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hours/Week on Information Gathering
          </label>
          <input
            type="range"
            min="5"
            max="40"
            value={hoursWeek}
            onChange={(e) => setHoursWeek(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-lg font-semibold text-blue-600">{hoursWeek} hours</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Hourly Rate ($)
          </label>
          <input
            type="range"
            min="50"
            max="150"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-lg font-semibold text-blue-600">${hourlyRate}/hour</div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">Projected Savings</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Time Saved/Week:</span>
            <span className="font-bold">{weeklyTimeSaved.toFixed(1)} hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cost Saved/Week:</span>
            <span className="font-bold">${weeklyCostSaved.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xl pt-4 border-t border-gray-200">
            <span className="text-gray-800">Annual Savings:</span>
            <span className="font-bold text-green-600">${annualSaved.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RiskMatrixGrid = () => {
  const [selectedRisk, setSelectedRisk] = useState(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskMatrix.map((risk, index) => {
          const Icon = risk.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                selectedRisk === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              onClick={() => setSelectedRisk(selectedRisk === index ? null : index)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  risk.severity === 'High' ? 'bg-red-100' :
                  risk.severity === 'Medium' ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    risk.severity === 'High' ? 'text-red-600' :
                    risk.severity === 'Medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">{risk.risk}</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-sm font-medium px-2 py-1 rounded ${
                      risk.severity === 'High' ? 'bg-red-200 text-red-800' :
                      risk.severity === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {risk.severity} Priority
                    </span>
                  </div>
                  {selectedRisk === index && (
                    <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <strong>Mitigation Strategy:</strong> {risk.mitigation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Timeline = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />
      
      {roadmapPhases.map((phase, index) => (
        <div
          key={index}
          className={`relative mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
          style={{ transitionDelay: `${index * 200}ms` }}
          onMouseEnter={() => setActivePhase(index)}
        >
          <div className="flex items-start">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
              activePhase === index 
                ? 'bg-blue-600 scale-110' 
                : 'bg-gray-400'
            }`}>
              <span className="text-white font-bold text-lg">{phase.phase}</span>
            </div>
            
            <div className={`ml-8 flex-1 p-6 rounded-lg transition-all duration-300 ${
              activePhase === index
                ? 'bg-blue-50 border-2 border-blue-200'
                : 'bg-white border-2 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl font-bold text-gray-800">{phase.title}</h4>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Days {phase.days}
                </span>
              </div>
              <ul className="space-y-2">
                {phase.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    agency: '',
    teamSize: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your interest! We\'ll be in touch soon.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agency
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.agency}
            onChange={(e) => setFormData({...formData, agency: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Size
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.teamSize}
            onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
          >
            <option value="">Select size</option>
            <option value="1-5">1-5 analysts</option>
            <option value="6-10">6-10 analysts</option>
            <option value="11-20">11-20 analysts</option>
            <option value="20+">20+ analysts</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message (Optional)
        </label>
        <textarea
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
        />
      </div>
      
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Request Demo
      </button>
    </div>
  );
};

// Main App Component
const ScrollytellingApp = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Determine active section
      const sections = document.querySelectorAll('section');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index) => {
    const sections = document.querySelectorAll('section');
    sections[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl">AI Policy Assistant</span>
            </div>
            <div className="hidden md:flex space-x-6">
              {['Challenge', 'Solution', 'Success', 'Risks', 'Roadmap', 'Start'].map((label, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(index)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    activeSection === index ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Scene 1: The Policy Analysis Challenge */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your Team's Hidden Time Drain
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Policy analysts are drowning in information gathering instead of delivering insights that matter
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <DonutChart data={timeAllocationData} />
              <div className="mt-8 space-y-4">
                {timeAllocationData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <span className="text-2xl font-bold">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <blockquote className="text-lg italic text-gray-700">
                    "I spend most of my day searching through documents, emails, and databases just to find relevant information. By the time I actually analyze it, I'm exhausted and pressed for time."
                  </blockquote>
                  <cite className="block mt-4 text-sm font-medium text-gray-600">
                    — Senior Policy Analyst, Federal Agency
                  </cite>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white rounded border border-gray-200">
                <h3 className="font-semibold mb-2">A Typical Week:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Reading reports & documents</span>
                    <span className="font-medium">15 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Searching databases</span>
                    <span className="font-medium">8 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email & communication mining</span>
                    <span className="font-medium">5 hours</span>
                  </div>
                  <div className="flex justify-between text-blue-600 font-semibold pt-2 border-t">
                    <span>Actual analysis & writing</span>
                    <span>12 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <ChevronDown className="w-8 h-8 text-gray-400 animate-bounce mx-auto" />
          </div>
        </div>
      </section>

      {/* Scene 2: Enter AI Assistants */}
      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              AI That Actually Understands Policy Work
            </h2>
            <div className="max-w-3xl mx-auto bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <p className="text-lg">
                <strong>AI Assistants</strong> = Specialized software that reads, analyzes, and synthesizes information like a research analyst, but at superhuman speed and scale.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Document Analysis</h3>
              <p className="text-gray-600">Process hundreds of pages in seconds, extract key insights, and maintain perfect recall</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Issue Tracking</h3>
              <p className="text-gray-600">Automatically categorize and track constituent concerns across all communication channels</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Research Synthesis</h3>
              <p className="text-gray-600">Connect dots across disparate sources to surface patterns and recommendations</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg mb-12">
            <h3 className="text-2xl font-bold mb-4 text-center">Real Example in Action</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="font-bold">1</span>
                  </div>
                  <span>Upload 500-page climate policy document</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="font-bold">2</span>
                  </div>
                  <span>AI processes in 30 seconds</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="font-bold">3</span>
                  </div>
                  <span>Get executive summary + key findings</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">2 min</div>
                <div className="text-xl">vs 2 days manual review</div>
              </div>
            </div>
          </div>

          <BeforeAfterSlider />
        </div>
      </section>

      {/* Scene 3: Proven Government Success Stories */}
      <section className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Agencies Already Winning with AI
            </h2>
            <p className="text-xl text-gray-600">
              Real results from your peers in government
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {caseStudiesData.map((study, index) => {
              const Icon = study.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm font-medium">{study.type}</span>
                      <Icon className="w-6 h-6 text-white/80" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{study.title}</h3>
                    <div className="text-center my-6">
                      <AnimatedCounter value={parseInt(study.metric)} suffix={study.metric.includes('%') ? '%' : study.metric.includes('x') ? 'x' : ''} />
                      <p className="text-gray-600 mt-2">{study.description}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-red-50 rounded">
                        <span className="text-gray-600">Before:</span>
                        <span className="font-medium text-red-600">{study.before}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-green-50 rounded">
                        <span className="text-gray-600">After:</span>
                        <span className="font-medium text-green-600">{study.after}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <ROICalculator />
        </div>
      </section>

      {/* Scene 4: Addressing Risks & Safeguards */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Yes, We're Thinking About Security Too
            </h2>
            <p className="text-xl text-gray-600">
              Every concern addressed with enterprise-grade safeguards
            </p>
          </div>

          <RiskMatrixGrid />

          <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">Compliance Checklist</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>NIST AI Risk Management Framework compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>FedRAMP authorized hosting options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>FIPS 140-2 encryption standards</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Section 508 accessibility compliance</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Complete audit trail for all AI decisions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Human-in-the-loop validation options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>No data leaves your infrastructure</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Regular third-party security audits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 5: Implementation Roadmap */}
      <section className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Your 90-Day Launch Plan
            </h2>
            <p className="text-xl text-gray-600">
              From pilot to production in three months
            </p>
          </div>

          <Timeline />

          <div className="mt-12 bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">Success Metrics Dashboard</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <div className="text-sm text-gray-600">Time Saved</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">3.2x</div>
                <div className="text-sm text-gray-600">More Reports</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-gray-600">User Satisfaction</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">$2.4M</div>
                <div className="text-sm text-gray-600">Annual Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 6: Call to Action */}
      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-white">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-6">
              Start Small, Win Big
            </h2>
            <p className="text-2xl text-blue-100">
              Join forward-thinking agencies transforming policy work with AI
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-12">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold mb-4">
                <AnimatedCounter value={2.5} suffix="x" />
              </div>
              <p className="text-xl">More policy reviews completed by teams using AI</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="bg-white/10 p-4 rounded">
                <h4 className="font-semibold mb-2">Investment Required:</h4>
                <ul className="space-y-1">
                  <li>• 90-day pilot program</li>
                  <li>• 5-7 analyst team</li>
                  <li>• 2 hours/week training</li>
                </ul>
              </div>
              <div className="bg-white/10 p-4 rounded">
                <h4 className="font-semibold mb-2">Expected Returns:</h4>
                <ul className="space-y-1">
                  <li>• 20+ hours/week saved per analyst</li>
                  <li>• 3x faster policy analysis</li>
                  <li>• $500K+ annual savings</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <button className="bg-white text-blue-600 font-semibold py-4 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Schedule Demo</span>
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center justify-center space-x-2 border border-white/30">
              <Download className="w-5 h-5" />
              <span>Download Guide</span>
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-lg hover:bg-white/30 transition-colors duration-200 flex items-center justify-center space-x-2 border border-white/30">
              <Mail className="w-5 h-5" />
              <span>Contact Peer Agency</span>
            </button>
          </div>

          <div className="bg-white text-gray-900 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Request Your Demo</h3>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 transform translate-y-full transition-transform duration-300" 
           style={{ transform: scrollProgress > 70 ? 'translateY(0)' : 'translateY(100%)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-semibold">Ready to transform your policy work?</p>
            <p className="text-sm text-blue-100">Join agencies saving 20+ hours per week</p>
          </div>
          <button className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-200">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScrollytellingApp;