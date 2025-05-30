import { useState, useEffect, useContext } from 'react';
import CommentForm from '../CommentForm/CommentForm';
import * as hootService from '../../services/hootService';
// import { show, create, createComment} from '../../services/hootService';

import { UserContext } from '../../contexts/UserContext';
import { useParams, Link } from "react-router";

const HootDetails = (props) => {
    const [hoot, setHoot] = useState(null);
    const { hootId } = useParams();
    const { user } = useContext(UserContext);

    const handleAddComment = async (commentFormData) => {
        const newComment = await hootService.createComment(
            hootId,
            commentFormData
        );
        setHoot({
            ...hoot,
            comments: [...hoot.comments, newComment]
        });
    };

    const handleDeleteComment = async (commentId) => {
        const deletedComment = await hootService.deleteComment(
            hootId,
            commentId
        );
        setHoot({
            ...hoot,
            comments: hoot.comments.filter(comment => comment._id !== deletedComment._id),
        });
    };

    useEffect(() => {
        const fetchHoot = async () => {
            const hootData = await hootService.show(hootId);
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
                        {hoot.author
                            ? `${hoot.author.username} posted on ${new Date(hoot.createdAt).toLocaleDateString()}`
                            : 'Posted by Unknown'}
                    </p>
                    {
                        hoot.author && user && hoot.author._id === user._id && (
                            <>
                                <Link to={`/hoots/${hootId}/edit`}>Edit</Link>
                                <button onClick={() => props.handleDeleteHoot(hootId)}>
                                    Delete
                                </button>
                            </>
                        )
                    }
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
                                {comment.author
                                    ? `${comment.author.username} posted on ${new Date(comment.createdAt).toLocaleDateString()}`
                                    : `Unknown user posted on ${new Date(comment.createdAt).toLocaleDateString()}`}
                            </p>
                            {
                                comment.author && user && comment.author._id === user._id && (
                                    <>
                                        <Link to={`/hoots/${hootId}/comments/${comment._id}`}>Edit</Link>
                                        <button onClick={() => props.handleDeleteComment(comment._id)}>
                                            Delete
                                        </button>
                                    </>
                                )
                            }
                        </header>
                        <p>{comment.text}</p>
                    </article>
                ))}
            </section>
        </main>
    )
};

export default HootDetails;
