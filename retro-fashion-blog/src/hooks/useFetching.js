import {useState} from "react";


export const useFetching = (callback) =>
{
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetching = async (...args) =>
    {
        try {
            setIsLoading(true);
            const res = await callback(...args);
            if(res) {
                setIsLoading(false);
                return res;
            }
        }
        catch (e) {
            setError(e.message);
        }
        finally {
            setIsLoading(false);
        }
    }

    return [fetching, isLoading, error];
}

