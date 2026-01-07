import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {

	const { url, token } = useContext(StoreContext)
	const [userData, setUserData] = useState({
		name: "",
		email: "",
		phone: ""
	})

	const fetchProfile = async () => {
		const response = await axios.get(url + "/api/user/get-profile", { headers: { token } })
		if (response.data.success) {
			const { name, email, phone } = response.data.userData;
			setUserData({ name, email, phone: phone || "" });
		} else {
			toast.error(response.data.message)
		}
	}

	const onChangeHandler = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setUserData(data => ({ ...data, [name]: value }))
	}

	const onSubmitHandler = async (event) => {
		event.preventDefault();
		const response = await axios.post(url + "/api/user/update-profile", userData, { headers: { token } });
		if (response.data.success) {
			toast.success(response.data.message);
		} else {
			toast.error(response.data.message);
		}
	}

	useEffect(() => {
		if (token) {
			fetchProfile();
		}
	}, [token])

	return (
		<div className='profile'>
			<h2>My Profile</h2>
			<form onSubmit={onSubmitHandler} className='profile-form'>
				<div className="profile-group">
					<label>Name</label>
					<input name='name' onChange={onChangeHandler} value={userData.name} type="text" placeholder='Your Name' required />
				</div>
				<div className="profile-group">
					<label>Email</label>
					<input name='email' value={userData.email} type="email" placeholder='Your Email' disabled className="disabled-input" />
				</div>
				<div className="profile-group">
					<label>Phone</label>
					<input name='phone' onChange={onChangeHandler} value={userData.phone} type="text" placeholder='Phone Number' />
				</div>

				<button type='submit'>Save Changes</button>
			</form>
		</div>
	)
}

export default Profile
