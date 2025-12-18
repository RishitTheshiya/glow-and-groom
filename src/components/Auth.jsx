import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', mobile: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginView) {
      const savedUser = JSON.parse(localStorage.getItem('registeredUser'));
      if (savedUser && savedUser.username === formData.username && savedUser.password === formData.password) {
        onLogin(savedUser);
      } else {
        alert("Invalid Username or Password");
      }
    } else {
      localStorage.setItem('registeredUser', JSON.stringify(formData));
      alert("Signup Successful! Please Login.");
      setIsLoginView(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] p-4">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-black text-slate-900 mb-2">{isLoginView ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Username" required className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 outline-none" onChange={(e) => setFormData({...formData, username: e.target.value})} />
          {!isLoginView && (
            <>
              <input type="email" placeholder="Email" required className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 outline-none" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="tel" placeholder="Mobile" required className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 outline-none" onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
            </>
          )}
          <input type="password" placeholder="Password" required className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 outline-none" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 shadow-lg">{isLoginView ? 'LOGIN' : 'SIGN UP'}</button>
        </form>
        <button onClick={() => setIsLoginView(!isLoginView)} className="w-full mt-6 text-blue-600 font-bold">{isLoginView ? "Don't have an account? Sign Up" : "Have an account? Login"}</button>
      </div>
    </div>
  );
};

export default Auth;