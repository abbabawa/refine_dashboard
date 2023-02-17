import { useGetIdentity } from "@pankod/refine-core"
import { useOne } from "@pankod/refine-core"
import { Profile } from "components"

const MyProfile = () => {
  const {data: user} = useGetIdentity()
  const {data, isLoading, isError} = useOne({resource: 'api/v1/users', id:user?.userid})

  const myProfile = data?.data ?? []

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error</div>
  return (
    <Profile
      type="My"
      name={myProfile.name}
      email={myProfile.email}
      avatar={myProfile.avatar}
      properties={myProfile.allproperties}
    />
  )
}

export default MyProfile