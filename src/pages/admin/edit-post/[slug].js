import dynamic from 'next/dynamic';

const EditPost = dynamic(() => import('../../../components/EditPost'), {
  ssr: false,
});

export default EditPost;
