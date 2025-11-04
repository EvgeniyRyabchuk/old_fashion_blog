import {useState} from "react";
import {toast} from "react-toastify";
import {Exception} from "sass";


export const useFetching = (callback) =>
{
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetching = async (...args) =>
    {
        try {
            setIsLoading(true);
            return await callback(...args);

        }
        catch (e) {
            toast.error(`Something went wrong! ${e.message}`);
            setError(e.message);
        }
        finally {
            setIsLoading(false);
        }
    }

    return [fetching, isLoading, error, setIsLoading];
}

