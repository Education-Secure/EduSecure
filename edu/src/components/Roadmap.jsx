import React, { useEffect, useState } from "react";
import { generateContent, chatWithTutor } from "../APIConfigs/AI";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebaseConfig"; // Adjust path as needed
import { MessageCircle, X, Send } from "lucide-react";
import "./roadmap.css";

const RoadmapPage = ({ skill }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [user, setUser] = useState(null);
  
  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRoadmapFromDB = async () => {
      if (!user?.email || !skill) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log(`Fetching roadmap for user: ${user.email}, skill: ${skill}`);
        
        // Direct Firebase fetch - much faster than API calls!
        const userDocRef = doc(db, "userInformation", user.email);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log("User data found:", userData.skills?.length || 0, "skills");
          
          // Find the specific skill in the skills array
          const skillData = userData.skills?.find(s => s.name === skill);
          
          if (skillData && skillData.roadmap) {
            console.log("Roadmap found for", skill);
            
            // Handle different roadmap structures
            if (skillData.roadmap.children) {
              setRoadmap(skillData.roadmap.children);
            } else {
              setRoadmap(skillData.roadmap);
            }
          } else {
            console.warn(`No roadmap found for skill: ${skill}`);
            throw new Error(`No roadmap found for skill: ${skill}`);
          }
        } else {
          console.error(`No user document found for: ${user.email}`);
          throw new Error(`No user document found for: ${user.email}`);
        }
        
      } catch (err) {
        console.error("Failed to fetch roadmap from database:", err);
        
        // Fallback to AI generation if DB fetch fails
        try {
          console.log("Attempting AI fallback generation...");
          const { generateRoadmap } = await import("../APIConfigs/AI");
          const fallbackData = await generateRoadmap(skill);
          setRoadmap(fallbackData);
          console.log("AI fallback successful");
        } catch (aiErr) {
          console.error("Fallback AI generation also failed:", aiErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapFromDB();
  }, [skill, user]);

  const handleTopicClick = async (topic) => {
    setSelectedNode(topic);
    setLoadingContent(true);
    try {
      const data = await generateContent(topic);
      setContent(data.content);
    } catch (err) {
      console.error("Failed to fetch content:", err);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = {
      id: Date.now(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      // Add context about current skill and selected topic
      const contextualQuestion = selectedNode 
        ? `In the context of learning ${skill}, specifically about "${selectedNode}": ${chatInput}`
        : `In the context of learning ${skill}: ${chatInput}`;
        
      const response = await chatWithTutor(contextualQuestion);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.answer || response.message || "I'm sorry, I couldn't process that question.",
        sender: 'bot',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen && chatMessages.length === 0) {
      // Add welcome message when first opening
      const welcomeMessage = {
        id: Date.now(),
        text: `Hi! I'm your ${skill} learning assistant. Feel free to ask me any questions about the topics in your roadmap!`,
        sender: 'bot',
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
    }
  };

  // Enhanced tree rendering for Firebase structure with children arrays
  const renderTree = (nodeArray, level = 0) => {
    if (!nodeArray || !Array.isArray(nodeArray)) {
      console.warn("Invalid nodeArray:", nodeArray);
      return null;
    }

    return nodeArray.map((node, index) => {
      const isLastItem = index === nodeArray.length - 1;
      const currentPath = `${level}-${index}`;
      
      return (
        <div key={currentPath} className="tree-item">
          {/* Connecting lines */}
          <div className="tree-connector">
            {level > 0 && (
              <>
                <div className={`vertical-line ${isLastItem ? 'short' : 'full'}`}></div>
                <div className="horizontal-line"></div>
              </>
            )}
          </div>
          
          {/* Node */}
          <div 
            className={`tree-node level-${level} ${selectedNode === node.name ? 'selected' : ''}`}
            onClick={() => handleTopicClick(node.name)}
          >
            <span className="node-text">{node.name}</span>
            {node.children && node.children.length > 0 && (
              <span className="node-count">({node.children.length})</span>
            )}
          </div>

          {/* Children */}
          {node.children && node.children.length > 0 && (
            <div className="subtree">
              {renderTree(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (loading) return (
    <div className="roadmap-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading {skill} roadmap...</p>
      </div>
    </div>
  );
  
  if (!roadmap) return (
    <div className="roadmap-container">
      <div className="roadmap-header">
        <h1 className="roadmap-title">Roadmap Not Found</h1>
      </div>
      <div className="roadmap-layout">
        <p className="roadmap-empty">
          No roadmap found for {skill}. 
          {!user ? " Please log in first." : " Try adding this skill from the main page."}
        </p>
      </div>
    </div>
  );

  return (
    <div className="roadmap-container">
      <div className="roadmap-header">
        <h1 className="roadmap-title">{skill} Learning Roadmap</h1>
        <p className="roadmap-subtitle">Click on any topic to explore detailed content</p>
      </div>
      
      <div className="roadmap-layout">
        <div className="roadmap-tree-section">
          <div className="tree-root">
            {renderTree(roadmap)}
          </div>
        </div>

        <div className="roadmap-content">
          <div className="content-header">
            <h2 className="content-title">Topic Details</h2>
            {/* Chatbot Toggle Button */}
            <button
              onClick={toggleChat}
              className="chatbot-toggle"
              title="Ask AI Assistant"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
          
          {loadingContent ? (
            <div className="loading-content">
              <div className="content-spinner"></div>
              <p>Loading content...</p>
            </div>
          ) : content ? (
            <div className="content-body">
              <h3>{selectedNode}</h3>
              <div className="content-text">{content}</div>
            </div>
          ) : (
            <div className="empty-content">
              <div className="empty-icon">📚</div>
              <p>Select a topic from the roadmap to see detailed content</p>
            </div>
          )}
        </div>
      </div>

      {/* Chatbot Modal */}
      {isChatOpen && (
        <div className="chatbot-overlay" onClick={(e) => e.target === e.currentTarget && setIsChatOpen(false)}>
          <div className="chatbot-modal">
            <div className="chatbot-header">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">AI Learning Assistant</h3>
                {selectedNode && (
                  <span className="text-sm text-gray-500">• {selectedNode}</span>
                )}
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="chatbot-close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="chatbot-messages">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-content">
                    {message.text}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))}
              
              {chatLoading && (
                <div className="chat-message bot-message">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleChatSubmit} className="chatbot-input">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything about this topic..."
                className="chat-input-field"
                disabled={chatLoading}
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="chat-send-button"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;