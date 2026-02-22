import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle, Award, Brain } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Master Medical Concepts with <br /> Single Best Answer & MTF Questions
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            The ultimate practice platform for medical students and professionals. Sharpen your clinical reasoning with our curated question bank.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quiz" className="bg-white text-blue-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center gap-2">
              <Brain size={24} />
              Start Practicing
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why MedMastery?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform is designed to mirror real exam formats, helping you build confidence and competence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">SBA & MTF Formats</h3>
              <p className="text-gray-600">Practice both Single Best Answer and Multiple True/False questions, covering the full spectrum of medical exam styles.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Detailed Rationales</h3>
              <p className="text-gray-600">Immediate feedback with comprehensive explanations for every answer, reinforcing your learning with every click.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Curated</h3>
              <p className="text-gray-600">Questions covering Cardiology, Respiratory, Neurology, and more, tailored for high-yield revision.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="container mx-auto text-center">
          <p className="mb-4 text-gray-500">© 2024 MedMastery. All rights reserved.</p>
          <div className="flex justify-center gap-6 items-center">
            <Link to="/login" className="hover:text-white transition-colors text-sm font-medium">
              Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
