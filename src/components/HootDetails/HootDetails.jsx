import { useState, useEffect} from 'react';
import {show} from '../../services//hootService'
import { useParams } from "react-router";

const HootDetails = (props) => {
    const [hoot, setHoot] = useState();
    const { hootId } = useParams();

    useEffect(() => {
        const fetchHoot = async () => {
            const hootData = await hootService.show(hootId);
            setHoot(hootData);
        }
        fetchHoot();  // we need to run fetchHoot when run useEffect
    }, [hootId]);
    console.log(hootId);
    return 
        <main>
        Hoot Details
        </main>;
  };
  
  export default HootDetails;
  