import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
// import HomePage from "./pages/home/HomePage";
// import LoginPage from "./pages/auth/login/LoginPage";
// import SignUpPage from "./pages/auth/signup/SignUpPage";
// import NotificationPage from "./pages/notification/NotificationPage";
// import ProfilePage from "./pages/profile/ProfilePage";

// import Sidebar from "./components/common/Sidebar";
// import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
// import LoadingSpinner from "./components/common/LoadingSpinner";

const HomePage = lazy(()=> import("./pages/home/HomePage"));
const LoginPage = lazy(()=> import("./pages/auth/login/LoginPage"));
const SignUpPage = lazy(()=>import("./pages/auth/signup/SignUpPage"));
const NotificationPage = lazy(()=>import("./pages/notification/NotificationPage"));
const ProfilePage = lazy(()=>import("./pages/profile/ProfilePage"));
const Sidebar = lazy(()=>import("./components/common/Sidebar"));
const RightPanel = lazy(()=>import("./components/common/RightPanel"));
const LoadingSpinner = lazy(()=>import("./components/common/LoadingSpinner"));

function App() {
	const { data: authUser, isLoading } = useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("authUser is here:", data);
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});

	if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

	return (
		<div className='flex max-w-6xl mx-auto'>
			<Suspense fallback={<div>Loading</div>}>
			{/* Common component, bc it's not wrapped with Routes */}
			{authUser && <Sidebar />}
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
			</Routes>
			{authUser && <RightPanel />}
			</Suspense>
			<Toaster />
		</div>
	);
}

export default App;
