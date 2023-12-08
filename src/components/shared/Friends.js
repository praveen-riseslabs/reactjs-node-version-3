import { Avatar } from "@mui/material";
import { fakeFriends } from "../../constants/fakeFriends";

function Friends() {
  const friends = fakeFriends.map((f) => {
    return (
      <div key={f.fullname} className="d-flex gap-2">
        <Avatar src={f.pic} sx={{ padding: 0, margin:0 }} />
        <div className="">
          <p className="">{f.fullname}</p>
          <p className="">{f.work}</p>
        </div>
      </div>
    );
  });

  return (
    <div className="px-3">
      <h3 className="py-2 fw-bold">Friends</h3>
      <div className="overflow-y-auto scroll-none" style={{ height: "42rem" }}>
        {friends}
      </div>
    </div>
  );
}

export default Friends;
