import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(): JSX.Element {
  return (
    <>
      <img
        src="https://raw.githubusercontent.com/octref/polacode/master/demo/1.png"
        alt="titulo do post"
        className={styles.banner}
      />
      <div className={commonStyles.container}>
        <div className={styles.postInformationsContainer}>
          <h1>Criando um app do zero</h1>

          <ul className={commonStyles.postInformations}>
            <li>
              <FiCalendar />
              <time>19 Abr 2021</time>
            </li>
            <li>
              <FiUser />
              <span>Joseph Oliveira</span>
            </li>
            <li>
              <FiClock />
              <span>4 min</span>
            </li>
          </ul>
          <span className={styles.editedAt}>
            * editado em 19 mar 2021, às 15:49
          </span>
        </div>

        <article>
          <h2>Lorem ipsum</h2>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod autem
            dolorum fuga similique alias, impedit est minima, sed, eum eius
            blanditiis iusto voluptatibus vitae soluta praesentium amet
            consequuntur at eligendi.
          </p>
        </article>
      </div>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
