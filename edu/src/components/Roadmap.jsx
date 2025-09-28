import React, { useEffect, useState } from "react";
import { generateContent } from "../APIConfigs/AI";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebaseConfig"; // Adjust path as needed
import "./roadmap.css";

const RoadmapPage = ({ skill }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [user, setUser] = useState(null);

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
          <h2 className="content-title">Topic Details</h2>
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
    </div>
  );
};

export default RoadmapPage;