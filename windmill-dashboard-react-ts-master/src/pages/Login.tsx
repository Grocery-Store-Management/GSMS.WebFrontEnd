import { Link, useHistory } from 'react-router-dom';
import React from 'react';
import ImageLight from '../assets/img/login-office.jpeg';
import ImageDark from '../assets/img/login-office-dark.jpeg';
import { FacebookIcon, GithubIcon, GoogleIcon } from '../icons';
import { Label, Input, Button } from '@windmill/react-ui';
import { firebase } from '../utils/firebase/firebase';
import '../styles/Login.css';
import BackgroundCircle from '../assets/img/background-circle-min.png';
import { useFirestore } from '../utils/firebase/firestore';
import { User } from '../models/User';
import '../styles/General.css';
import { ROLE } from '../Shared/Model';

function Login() {
  const history = useHistory();
  const firestore = firebase.firestore();

  const SignInWithGoogle = () => {
    var google_provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(google_provider)
      .then(async (response) => {
        const user = response.user;
        const token: any = await user?.getIdToken();
        localStorage.setItem("USER", JSON.stringify(user));
        localStorage.setItem("token", token);
        firestore.collection("gsms-employee").doc(user?.uid).get()
          .then((doc) => {
            if (doc.exists) {
              localStorage.setItem("role", JSON.stringify(doc.data()));
              console.log("Document data:", doc.data());
              if (doc.data()?.role == ROLE.admin) {
                history.push('/app/reports');
              } else {
                history.push('/app/receipt');
              }
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const SignInWithFacebook = () => {
    var facebook_provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(facebook_provider)
      .then(async (response) => {
        const user = response.user;
        const token: any = await user?.getIdToken();
        localStorage.setItem("USER", JSON.stringify(user));
        localStorage.setItem("token", token);
        firestore.collection("gsms-employee").doc(user?.uid).get()
          .then((doc) => {
            if (doc.exists) {
              localStorage.setItem("role", JSON.stringify(doc.data()));
              console.log("Document data:", doc.data());
              if (doc.data()?.role == ROLE.admin) {
                history.push('/app/reports');
              } else {
                history.push('/app/receipt');
              }
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const SignInWithGitHub = () => {
    var github_provider = new firebase.auth.GithubAuthProvider();

    firebase.auth().signInWithPopup(github_provider)
      .then(async (response) => {
        const user = response.user;
        const token: any = await user?.getIdToken();
        localStorage.setItem("USER", JSON.stringify(user));
        localStorage.setItem("token", token);
        firestore.collection("gsms-employee").doc(user?.uid).get()
          .then((doc) => {
            if (doc.exists) {
              console.log("Document data:", doc.data());
              history.push('/app');
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900" style={{ zIndex: -1, overflow: "hidden" }}>
      <img src={BackgroundCircle} alt="background" className='circle-background' />
      <div className='login-box '>
        <div
          style={{ zIndex: 1, overflow: "hidden" }}
          className="h-full max-w-3xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800"
        >
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full dark:hidden"
                src={ImageLight}
                alt="Office"
              />
              <img
                aria-hidden="true"
                className="hidden object-cover w-full h-full dark:block"
                src={ImageDark}
                alt="Office"
              />
            </div>
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Welcome to GS250
                </h1>
                <Label>
                  <span>Email</span>
                  <Input css="" className="mt-1" type="email" placeholder="exmaple@gmail.com" />
                </Label>

                <Label className="mt-4">
                  <span>Password</span>
                  <Input css="" className="mt-1" type="password" placeholder="***************" />
                </Label>

                <p className="mt-4">
                  <Link
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline float-right"
                    to="/forgot-password"
                  >
                    Forgot your password?
                  </Link>
                </p>
                <button type='submit' className="col col-md-12 mt-4 b-10 text-changed">
                  LOGIN
                </button>

                <div className="d-flex flex-row my-8 mt-4" >
                  <span className='line-break mr-4'></span>
                  <span>or</span>
                  <span className='line-break ml-4'></span>
                </div>

                <Button className="button" block layout="outline" onClick={SignInWithGoogle}>
                  <GoogleIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                  Google
                </Button>

                {/* <Button className="button mt-4" block layout="outline" onClick={SignInWithGitHub}>
                  <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                  Github
                </Button> */}

                <Button className="button mt-4" block layout="outline" onClick={SignInWithFacebook}>
                  <FacebookIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                  Facebook
                </Button>

              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
