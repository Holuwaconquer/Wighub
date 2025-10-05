import React, { useState } from "react";
import login_illustrator from "../../public/login_illustrator.png";
import { useFormik } from "formik";
import * as yup from "yup";
import { BiHide, BiShow } from "react-icons/bi";
import axios from "axios";

const RegisterPage = () => {
  const [passwordtype, setpasswordtype] = useState("password");
  const API_URL = import.meta.env.VITE_BACKEND_PORT;
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: ""
    },
    onSubmit: (values) => {
      console.log(values);
      axios.post(`${API_URL}/user/register`, values)
      .then((res) =>{
        console.log('user registered!', res);
        if(res.status === 400){
            console.log("an account with this email has already been registered");   
        }else if(res.data.status){
            console.log("Account registered successfully");
        }
      }).catch((err) =>{
        console.log('cannot register user', err);
      })
    },


    validationSchema: yup.object({
        name: yup.string().required("This field is required"),
      email: yup
        .string()
        .required("This field is required")
        .email("This is not a valid email"),
      password: yup.string().required("This field is required"),
    }),
  });
  return (
    <div className="w-full h-full justify-center md:justify-stretch flex flex-col gap-4 px-[20px] md:px-[7%] py-[4%] bg-[#F4F6FA]">
      <h1>PROMAX CARE</h1>
      <div className="w-full grid md:grid-cols-2 md:gap-4 md:justify-between items-center">
        <div className="w-full flex flex-col gap-4 ">
          <h1 className="text-[20px] md:text-[48px] font-bold text-[#030637] ">
            Build for maximum care and support
          </h1>
          <p className="w-full font-[18px]">
            Easily manage day to day operations from onboarding through to
            appointment booking and more
          </p>
          <img src={login_illustrator} className="w-3/4" alt="" />
        </div>

        <div className="w-full flex flex-col gap-8 justify-center items-center bg-white py-[60px] px-[10px] md:px-[50px] rounded-[35px]">
          <h1 className="text-[24px]">PROMAX CARE</h1>
          <form
            onSubmit={formik.handleSubmit}
            className="w-full flex flex-col gap-4"
          >
            <h1>Register</h1>
            <div className="w-full flex flex-col gap-0">
              <label
                htmlFor="name"
                className="text-[16px] font-medium text-[#4E4E4E]"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full p-3 outline-0 border-b border-[#ABABAB] rounded-[5px]"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <small className="text-red-600">{formik.errors.name && formik.touched.name ? formik.errors.name : null}</small>
            </div>
            <div className="w-full flex flex-col gap-0">
              <label
                htmlFor="email"
                className="text-[16px] font-medium text-[#4E4E4E]"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="w-full p-3 outline-0 border-b border-[#ABABAB] rounded-[5px]"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <small className="text-red-600">{formik.errors.email && formik.touched.email ? formik.errors.email : null}</small>
            </div>
            <div className="w-full flex flex-col gap-0">
              <label
                htmlFor="email"
                className="text-[16px] font-medium text-[#4E4E4E]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordtype}
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 outline-0 border-b border-[#ABABAB] rounded-[5px]"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button>
                  {passwordtype === "password" ? (
                    <BiHide
                      onClick={() => setpasswordtype("text")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    />
                  ) : (
                    <BiShow
                      onClick={() => setpasswordtype("password")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    />
                  )}
                </button>
                <small className="text-red-600">{formik.errors.password && formik.touched.password ? formik.errors.password : null}</small>
              </div>
            </div>
            <div className="w-full flex justify-between items-center gap-2">
              <div className="flex gap-2 items-center">
                <input type="checkbox" className="text-[#FFFFFF] w-[20px] h-[20px]" />
                <p className="text-[14px]">Remember me</p>
              </div>

              <a href="#" className="text-[14px]">
                Forgot password?
              </a>
            </div>

            <button type="submit" disabled={!(formik.isValid && formik.dirty)} className={`bg-[#030637] text-white rounded-[5px] p-[10px] gap-[10] mb-[3px] w-full hover:scale-[1.02] transition-transform ${!(formik.isValid && formik.dirty) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
              Sign Up
            </button>
            <p className="text-center justify-center items-center text-[#5C5C5C]">Already have an Account? <a href="/login" className="text-[#405189]">Login here</a></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
