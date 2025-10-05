import React, { useState } from "react";
import login_illustrator from "../../public/login_illustrator.png";
import { useFormik } from "formik";
import * as yup from "yup";
import { BiHide, BiShow } from "react-icons/bi";
import axios from "axios";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [passwordtype, setpasswordtype] = useState("password");
  const API_URL = import.meta.env.VITE_BACKEND_PORT;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values);
      axios.post(`${API_URL}/user/login`, values)
      .then((res) =>{
        console.log('user logged in!', res);
        if(res.data.status){
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'You have successfully logged in!',
              })
        }
        
      }).catch((err) =>{
        if (err.response && err.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Invalid email or password. Please try again.",
          });
        } 
        else if (err.response && err.response.status === 404) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'This email is not registered, please sign up first.',
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Register Now!",
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Redirecting...", "You will be redirected to the registration page.", "success");
                    setTimeout(() => {
                        window.location.href = "/register";
                    }, 2000);
                }
            });
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "Something went wrong. Please try again later.",
          });
        }
        console.error("Login error:", err);
      })
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .required("This field is required")
        .email("This is not a valid email"),
      password: yup.string().required("This field is required"),
    }),
  });
  return (
    <div className="w-full flex flex-col gap-4 px-[7%] py-[4%] bg-[#F4F6FA]">
      <h1>PROMAX CARE</h1>
      <div className="w-full grid md:grid-cols-2 gap-4 justify-center md:justify-between items-center">
        <div className="w-full flex flex-col gap-4 ">
          <h1 className="text-[48px] font-bold text-[#030637] ">
            Build for maximum care and support
          </h1>
          <p className="w-full font-[18px]">
            Easily manage day to day operations from onboarding through to
            appointment booking and more
          </p>
          <img src={login_illustrator} className="w-3/4" alt="" />
        </div>

        <div className="w-full flex flex-col gap-8 justify-center items-center bg-white py-[60px] px-[50px] rounded-[35px]">
          <h1 className="text-[24px]">PROMAX CARE</h1>
          <form
            onSubmit={formik.handleSubmit}
            className="w-full flex flex-col gap-4"
          >
            <p>Sign in</p>
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
              />
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

            <button type="submit" className="bg-[#030637] text-white rounded-[5px] p-[10px] gap-[10] mb-[3px] w-full hover:scale-[1.02] transition-transform cursor-pointer">
              Sign in
            </button>
            <p className="text-center justify-center items-center text-[#5C5C5C]">Don’t have an Account? <a href="/signin" className="text-[#405189]">Sign Up</a></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
