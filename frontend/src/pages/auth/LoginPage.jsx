import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
	return (
		<div className='flex justify-center sm:px-6 lg:px-8 py-4'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md py-6'>
				<img className='mx-auto h-40 w-auto' src='/cc.png' alt='CareerConnect' />
				<h2 className=' text-center text-3xl font-extrabold pt-6 text-gray-900'>Sign in to your account</h2>
			</div>

			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
				<div className='bg-white pt-6 px-4 shadow sm:rounded-lg sm:px-10'>
					<LoginForm />
					<div className='mt-2'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-500'>New to CareerConnect?</span>
							</div>
						</div>
						<div className='mt-2'>
							<Link
								to='/signup'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50'
							>
								Join now
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
