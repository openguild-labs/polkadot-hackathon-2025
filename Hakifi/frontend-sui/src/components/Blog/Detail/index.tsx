"use client";

import GHOST_DETAIL from '@/@type/blog.type';
import TelegramIcon from '@/components/common/Icons/TelegramIcon';
import TwitterIcon from '@/components/common/Icons/TwitterIcon';
import { Separator } from '@/components/common/Separator';
import Spinner from '@/components/common/Spinner';
import { formatTime } from '@/utils/format';
import { usePathname } from 'next/navigation';
import Related from './Related';
type BlogDetailProps = {
  post?: GHOST_DETAIL;
  relatedPosts?: GHOST_DETAIL[];
};

import FacebookIcon from '@/components/common/Icons/FacebookIcon';
import LinkedinIcon from '@/components/common/Icons/LinkedinIcon';
import RedditIcon from '@/components/common/Icons/RedditIcon';
import '@/styles/blog.scss';
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton
} from 'next-share';
import parseRichText from '../components/HtmlPaser';


const BlogDetail = ({ post, relatedPosts }: BlogDetailProps) => {
  const pathname = usePathname();

  if (!post) {
    return <section className="flex flex-col items-center justify-center min-h-[236px] gap-2">
      <Spinner size="small" />
    </section>;
  }

  const shareUrl = process.env.NEXT_PUBLIC_API_BASE_URL + pathname;

  const content = parseRichText(post.html);

  return (
    <>

      <section id="ghost_global">
        <section className="lg:max-w-[832px] mx-auto lg:mt-15 mt-10 ghost_content px-4 lg:px-4">
          <p className="text-title-20 lg:text-title-24 text-typo-primary">{post?.title}</p>

          <section className="flex items-center gap-2 lg:gap-3 my-4 lg:my-5">
            <p className="text-body-14 text-typo-secondary">{formatTime(post?.created_at || new Date())}</p>
            <section className="flex items-center gap-2 lg:gap-3">
              {
                post?.tags.map(item => {
                  return <section key={item.id} className="text-body-12 lg:text-body-14 py-1 px-2 bg-background-primary rounded-sm">{item.name}</section>;
                })
              }
            </section>
          </section>
          <div className="gh-canvas ghost_cards">

            {/* <div className="mt-4 lg:mt-5 text-typo-secondary gh-content" dangerouslySetInnerHTML={{ __html: post?.html }} /> */}
            <div className="mt-4 lg:mt-5 text-typo-secondary gh-content">
              {content}
            </div>

          </div>

          <Separator className="my-4 lg:my-5" />

          <section className="flex lg:justify-normal justify-between items-center gap-3">
            <div className="text-body-14 text-typo-primary">Share post</div>
            <section className="flex items-center gap-3 text-support-black">
              <TwitterShareButton url={shareUrl} key="tw">
                <TwitterIcon className="size-7" fill="#F37B23" />
              </TwitterShareButton>
              <FacebookShareButton url={shareUrl} key="fa">
                <FacebookIcon className="size-7" fill="#F37B23" />
              </FacebookShareButton>
              <TelegramShareButton url={shareUrl} key="tl">
                <TelegramIcon className="size-7" fill="#F37B23" />
              </TelegramShareButton>

              <LinkedinShareButton url={shareUrl} key="link">
                <LinkedinIcon className="size-7" fill="#F37B23" />
              </LinkedinShareButton>

              <RedditShareButton url={shareUrl} key="rd">
                <RedditIcon className="size-7" fill="#F37B23" />
              </RedditShareButton>
            </section>
          </section>

        </section>
      </section>

      <section className="mt-16 px-4 lg:px-5 mb-15">
        <section className="text-heading-3 text-typo-primary uppercase">Related post</section>

        <section className="mt-4">
          <Related related={relatedPosts || []} />
        </section>
      </section>
    </>
  );
};

export default BlogDetail;