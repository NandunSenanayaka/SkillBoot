import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllAccounts } from "../feature/followingAccounts/followingAccountSlice";
import FollowerAccountItem from "./FollowerAccountItem";

function AllAccounts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const storeFollowerAccounts = useSelector(
    (state) => state.followingAccountReducer.followerAccounts
  );

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
    dispatch(getAllAccounts());
  }, []);

  const filteredAccounts = storeFollowerAccounts?.filter(account => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${account.firstName} ${account.lastName}`.toLowerCase();
    return fullName.includes(searchLower);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">List of User Accounts</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          // className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {filteredAccounts ? (
        filteredAccounts.map((followerAccount) => {
          return (
            <FollowerAccountItem
              key={followerAccount.id}
              id={followerAccount.id}
              firstName={followerAccount.firstName}
              lastName={followerAccount.lastName}
            />
          );
        })
      ) : (
        <span></span>
      )}
    </div>
  );
}

export default AllAccounts;
