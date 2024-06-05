import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import HeaderHide from '../../components/my-scholarships/ui/HeaderHide';
import BackButtonHeader from '../../components/ui/BackButtonHeader';
import StatusCheck from '../../components/my-scholarships/ui/StatusCheck';
import BookmarkFilledIcon from '../../components/ui/icon/BookmarkFilledIcon';
import ChevronRightIcon from '../../components/ui/icon/ChevronRightIcon';
import Button from '../../components/ui/Button';
import MessageDotsIcon from '../../components/ui/icon/MessageDotsIcon';
import Divider from '../../components/ui/Divider';
import PencilIcon from '../../components/ui/icon/PencilIcon';
import FileDescriptionIcon from '../../components/ui/icon/FileDescriptionIcon';
import DotsMenuWrapper from '../../components/cover-letter/dots-menu/DotsMenuWrapper';
import axios from '../../api/axios';
import WhiteBackground from '../../components/ui/global-style/WhiteBackground';
import dayjs from 'dayjs';

const MyScholarshipDetail = () => {
  const params = useParams<{ id: string }>();

  const [myScholarship, setMyScholarship] = useState<{
    applyId: number;
    announcementId: number;
    applyStatus: string;
    announcementImageUrl: string;
    scholarShipName: string;
    scholarShipFoundation: string;
    applicationPeriod: string;
    myCoverLetterList: {
      coverLetterId: number;
      title: string;
      localDateTime: string;
    }[];
  }>({
    applyId: 1,
    announcementId: 1,
    applyStatus: 'APPLYING',
    announcementImageUrl: '/images/scholarship/scholarship1.jpeg',
    scholarShipName: '월곡주얼리',
    scholarShipFoundation: '서울시',
    applicationPeriod: '2024.05.01 ~ 2024.05.31',
    myCoverLetterList: [],
  });

  const myScholarshipId = Number(params.id);

  useQuery({
    queryKey: ['apply-list', myScholarshipId],
    queryFn: async () => {
      const res = await axios.get(`/apply-list/${myScholarshipId}`);
      console.log(res.data.data);
      setMyScholarship(res.data.data);
      return res.data;
    },
  });

  const formatDateString = (dateString: string) => {
    const date = dayjs(dateString);
    return date.format('YYYY.MM.DD');
  };

  return (
    <main className="px-0 pb-16 md:px-4">
      <HeaderHide />
      <WhiteBackground />
      <BackButtonHeader
        backButton={{
          label: '내 장학금',
          backUrl: '-1',
        }}
        fixed
        className="px-4 md:px-0"
      />
      <div className="mx-auto max-w-screen-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
          <div className="relative aspect-square w-full">
            <img
              src={myScholarship.announcementImageUrl}
              alt={myScholarship.scholarShipName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between px-4 py-4 pb-0 md:px-0">
                <StatusCheck
                  myScholarshipId={myScholarshipId}
                  status={myScholarship.applyStatus}
                />
                <div>
                  <span className="text-[1.5rem] text-primary">
                    <BookmarkFilledIcon />
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 px-4 py-4 md:px-0">
                <div className="text-lg-200 text-gray-40">
                  {myScholarship.scholarShipFoundation}
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="title-sm-300 text-gray-80">
                    {myScholarship.scholarShipName}
                  </h1>
                  <div className="text-md-200 text-gray-40">
                    {myScholarship.applicationPeriod}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Link
                to={`/scholarships/${myScholarship.announcementId}`}
                className="flex w-full items-center justify-center gap-1 border border-gray-05 py-4 text-gray-40"
              >
                <span className="text-md-200">공고로 이동하기</span>
                <span>
                  <ChevronRightIcon />
                </span>
              </Link>
              <div className="px-4 py-6 md:px-0">
                <Button variant="light-primary">
                  <div className="flex items-center gap-1">
                    <span className="text-[1.25rem]">
                      <MessageDotsIcon />
                    </span>
                    <span>후기 작성하기</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="block md:hidden">
          <Divider />
        </div>
        <div className="flex items-center justify-between p-4 lg:pt-8">
          <h2 className="title-sm-300 text-gray-80">작성한 자기소개서</h2>
          <Link
            to="/cover-letters/new"
            className="flex items-center gap-1 text-primary"
          >
            <span className="text-[1.125rem]">
              <PencilIcon />
            </span>
            <span className="text-md-200">작성하기</span>
          </Link>
        </div>
        <ul>
          {myScholarship.myCoverLetterList.length === 0 ? (
            <div className="text-lg-200 px-4 py-10 text-center text-gray-40">
              작성한 자기소개서가 없어요
            </div>
          ) : (
            myScholarship.myCoverLetterList.map((coverLetter) => (
              <li
                key={coverLetter.coverLetterId}
                className="border-b border-gray-05 last:border-b-0"
              >
                <Link
                  to={`/cover-letters/${coverLetter.coverLetterId}`}
                  className="flex flex-col gap-2 px-6 py-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-[1.25rem] text-gray-30">
                        <FileDescriptionIcon />
                      </span>
                      <h2 className="text-lg-200 text-gray-80">
                        {coverLetter.title}
                      </h2>
                    </div>
                    <DotsMenuWrapper
                      coverLetterId={coverLetter.coverLetterId}
                    />
                  </div>
                  <div className="text-md-200 flex items-center gap-2 text-gray-30">
                    <span>{formatDateString(coverLetter.localDateTime)}</span>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
};

export default MyScholarshipDetail;
