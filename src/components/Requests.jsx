import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {

    const requests = useSelector((store) => store.requests);
    const dispatch = useDispatch();

    const reviewRequest = async (status, _id) => {
        try {
            const res = await axios.post(BASE_URL + "/request/review/" + status + "/" + _id, 
                {}, 
                { withCredentials: true }
            );
            dispatch(removeRequest(_id));
        } catch (err) {
            // Handle the error
        }
    }

    const fetchRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/requests/recieved", {
                withCredentials: true
            });
            dispatch(addRequests(res?.data?.data));
        } catch (err) {
            // Handle the Error
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if(!requests) return;

    if(requests.length === 0) return <h1 className="flex justify-center my-10 text-bold text-red-400 text-2xl">No Connection Requests Found</h1>;

    return (
        <div className="text-center my-10">
          <h1 className="text-bold text-white text-3xl">Connection Requests</h1>

        {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } = request.fromUserId;

            return (
                <div key={_id} className="flex items-center m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto">
                    <div>
                        <img alt="photo" className="w-20 h-20 rounded-full" src={photoUrl}/>
                    </div>

                    <div className="text-left mx-4">
                        <h2 className="font-bold text-xl">
                            {firstName + " " + lastName}
                        </h2>
                        {age && gender && <p>{age + ", " + gender}</p>}
                        <p>{about}</p>
                    </div>
                <div className="ml-36">
                    <button className="btn btn-primary mx-2" onClick={() => reviewRequest("rejected", request._id)} >Reject</button>
                    <button className="btn btn-secondary mx-2" onClick={() => reviewRequest("accepted", request._id)} >Accept</button>
                </div>
            </div>
            )
        })}

        </div>
    );
};

export default Requests;