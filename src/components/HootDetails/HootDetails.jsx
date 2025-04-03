import { useState, useEffect} from 'react';
import CommentForm from '../CommentForm/CommentForm';
import { show } from '../../services/hootService';
import { useParams } from "react-router";

const HootDetails = (props) => {
    const [hoot, setHoot] = useState();
    const { hootId } = useParams();

    const handleAddComment = async (commentFormData) => {
        console.log('Comment Form Data: ', commentFormData);
    }

    useEffect(() => {
        const fetchHoot = async () => {
            const hootData = await show(hootId);
            setHoot(hootData);
        }
        fetchHoot();  // we need to run fetchHoot when run useEffect
    }, [hootId]);
    if (!hoot) return <main>Loading....</main>

    return (
        <main>
            <section>
                <header>
                    <p>{hoot.category.toUpperCase()}</p>
                    <h1>{hoot.title}</h1>
                    <p>
                        {`${hoot.author.username} posted on
                        ${new Date(hoot.createdAt).toLocaleDateString()}`}
                    </p>
                </header>
                <p>{hoot.text}</p>
            </section>
            <section>
                <h2>Comments</h2>
                <CommentForm 
                   handleAddComment={handleAddComment}
                />
                {!hoot.comments.length && <p>There are no comments</p>}
                {hoot.comments.map((comment) => (
                    <article key={comment._id}>
                        <header>
                            <p>
                              {`${comment.author.username} posted on
                              ${new Date(comment.createdAt).toLocaleDateString()}`}
                            </p>
                        </header>
                    </article>
                ))}
            </section>
        </main>
    ) 
  };
  
  export default HootDetails;
  