import React from 'react'

const ProfileContext = React.createContext({
  profileuserName: '',
  profilepasseord: '',
  updateProfileUserName: () => {},
  updateProfilePassword: () => {},
})

export default ProfileContext
