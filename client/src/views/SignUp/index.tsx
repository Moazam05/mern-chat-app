import { useState } from "react";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User Name"
          className="block w-full rounded-sm p-2 mb-2 border"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full rounded-sm p-2 mb-2 border"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
