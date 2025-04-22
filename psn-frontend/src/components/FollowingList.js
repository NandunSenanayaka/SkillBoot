import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFollowingAccounts } from "../feature/followingAccounts/followingAccountSlice";
import FollowingAccountItem from "./FollowingAccountItem";

function FollowingList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const storeFollowingAccounts = useSelector(
    (state) => state.followingAccountReducer.followingAccounts
  );

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
    
    dispatch(getFollowingAccounts());
  }, []);

  const filteredFollowing = storeFollowingAccounts?.filter(account => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${account.firstName} ${account.lastName}`.toLowerCase();
    return fullName.includes(searchLower);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Following List</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search following by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {filteredFollowing ? (
        filteredFollowing.map((followingAccount) => {
          return (
            <FollowingAccountItem
              key={followingAccount.id}
              id={followingAccount.id}
              firstName={followingAccount.firstName}
              lastName={followingAccount.lastName}
            />
          );
        })
      ) : (
        <span></span>
      )}
    </div>
  );
}

export default FollowingList;
