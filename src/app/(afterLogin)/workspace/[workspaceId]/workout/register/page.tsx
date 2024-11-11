'use client';

import pencil from '@/../public/svgs/workspace/pencil.svg';
import photo from '@/../public/svgs/workspace/photo.svg';
import plus from '@/../public/svgs/plus.svg';
import checkedCircle from '@/../public/svgs/workspace/checkedCircle.svg';
import nonCheckedCircle from '@/../public/svgs/workspace/nonCheckedCircle.svg';
import warning from '@/../public/svgs/workspace/warning.svg';

import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useWorkoutStore } from '@/hooks/useWorkout';
import { Input } from '@/components/ui/input';
import { s3PutPresifnedUrls, workout } from '@/api/workout';
import { useParams, useRouter } from 'next/navigation';

export default function Page() {
  const { workspaceId } = useParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoCheck, setPhotoCheck] = useState(false);
  const [comment, setComment] = useState('');
  const [imagePreview, setImagePreview] = useState<File | null>(null);

  const { workoutInfo } = useWorkoutStore();

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(file);
    }
  };

  const handleImageRemove = (e: any) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImagePreview(null);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    if (imagePreview) {
      const imageUrl = await s3PutPresifnedUrls(imagePreview);

      const data = {
        imageUrl,
        comment,
        willLink: photoCheck,
        missions: workoutInfo.missions.map(({ id, count }) => ({ id, count })),
      };
      try {
        const workoutRes = await workout({ workspaceId, data });
        console.log(workoutRes);
        if (workoutRes.status === 200) {
          router.push(`/workspace/${workspaceId}`);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('이미지를 등록해주세요!');
    }
  };

  return (
    <div className="">
      <div className="mb-6">
        <Label htmlFor="photo" className="flex items-center justify-start mb-2">
          <Image src={photo} alt="photo" className="mr-1" />
          <span className="text-base mr-1">사진 등록</span>
          <span className="text-base">(필수)</span>
        </Label>
        <div className="flex justify-start items-end gap-1">
          <div
            className="w-24 h-24 bg-[#F9FAFB] rounded-lg flex justify-center items-center relative"
            onClick={handleClick}
          >
            <span
              className="absolute right-0 -top-2 text-white bg-red-500 rounded-full"
              onClick={(e) => handleImageRemove(e)}
            >
              x
            </span>
            {imagePreview ? (
              <img
                src={URL.createObjectURL(imagePreview)}
                alt="preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Image src={plus} alt="plus" />
            )}
          </div>
          <div onClick={() => setPhotoCheck((v) => !v)}>
            <span
              className={`${
                photoCheck ? 'text-[#1F2937]' : ' text-[#B7C4D5]'
              } text-[10px] flex`}
            >
              <Image
                src={photoCheck ? checkedCircle : nonCheckedCircle}
                alt="check"
                className="mr-1"
              />
              사진 커뮤니티에도 사진을 등록할까요?
            </span>
          </div>

          <Input
            required
            id="photo"
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>
      </div>
      <hr className="-mx-6 mb-6" />
      <div className="mb-2">
        <Label
          htmlFor="pencil"
          className="flex items-center justify-start mb-2"
        >
          <Image src={pencil} alt="pencil" className="mr-1" />
          <span className="text-base mr-1">코멘트 작성</span>
          <span className="text-base">(선택)</span>
        </Label>
        <div>
          <textarea
            id="pencil"
            className="bg-[#F9FAFB] px-3 py-[10px] w-full h-24 rounded-lg appearance-none focus:outline-none placeholder:text-xs text-xs"
            placeholder="운동에 대한 간단한 코멘트를 작성해주세요!"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <Image src={warning} alt="warning" />
        <label
          htmlFor="terms"
          className="font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[10px] text-[#F87171]"
        >
          성의없는 운동인증은 이의제기를 받을 수 있습니다. 또한 운동인증은 하루
          최대 3번까지만 등록 가능합니다.
        </label>
      </div>
      <div className="bg-[#EFF6FF] min-h-96 h-full -mx-6">
        {workoutInfo.missions.map((item, i) => {
          const isLast = i === workoutInfo.missions.length - 1;
          return (
            <div
              key={item.id}
              className={`px-6 py-4 ${
                !isLast ? 'border-b' : null
              } border-[#E5E7EB] flex justify-between items-center`}
            >
              <div>
                <h3>{item.mission}</h3>
                <h5 className="text-xs font-light">{`${item.score}점`}</h5>
              </div>
              <div className="text-2xl mr-4">{item.count}</div>
            </div>
          );
        })}
      </div>
      <div className="w-full fixed bottom-10">
        <button
          className={`py-3 w-[90%] bg-main text-white
             rounded-full flex justify-center items-center text-base`}
          onClick={handleSubmit}
        >
          <span>인증 등록하기</span>
        </button>
      </div>
    </div>
  );
}