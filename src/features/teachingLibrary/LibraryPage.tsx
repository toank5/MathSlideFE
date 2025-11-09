import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, List, Typography, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGradeList } from '../grade/gradesSlice';
import { chapterApi } from '../chapter/chapterApi';
import { lessonApi } from '../lesson/lessonApi';
import type { Chapter } from '../chapter/chapter';
import type { Lesson } from '../lesson/lesson';
import { Link, useNavigate } from 'react-router-dom';
import { presentationApi } from '@/featurers/slideEditor/api/presentationApi';
import { Modal, message } from 'antd';

const { Title } = Typography;

const LibraryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { gradeList, isLoading: isGradesLoading } = useAppSelector((state) => state.grades);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isChaptersLoading, setChaptersLoading] = useState(false);
  const [isLessonsLoading, setLessonsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState<string | null>(null);

  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchGradeList());
  }, [dispatch]);

  useEffect(() => {
    if (selectedGradeId) {
      setChaptersLoading(true);
      setLessons([])
      chapterApi.getByGradeId(selectedGradeId)
        .then(data => setChapters(data))
        .catch(err => console.error("Failed to fetch chapters:", err))
        .finally(() => setChaptersLoading(false));
    } else {
      setChapters([]);
    }
  }, [selectedGradeId]);

  useEffect(() => {
    if (selectedChapterId) {
      setLessonsLoading(true);
      lessonApi.getByChapterId(selectedChapterId)
        .then(data => setLessons(data))
        .catch(err => console.error("Failed to fetch lessons:", err))
        .finally(() => setLessonsLoading(false));
    } else {
      setLessons([]);
    }
  }, [selectedChapterId]);

  const handleCreatePresentation = async (lessonId: string, lessonName: string) => {
    setIsCreating(lessonId);
    try {
      const response = await presentationApi.post(lessonId, lessonName);
      if (response.data) {
        navigate(`/slide-editor/${response.data.data.id}`);
      }
    } catch (error) {
      console.error("Failed to create presentation:", error);
    } finally {
      setIsCreating(null);
    }
  };

  const handleDeletePresentation = (presentationId: string, lessonName: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa slide cho bài học "${lessonName}" không? Hành động này không thể hoàn tác.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await presentationApi.delete(presentationId);
          message.success('Đã xóa slide thành công!');
          // Refresh the lesson list to update UI
          if (selectedChapterId) {
            setLessonsLoading(true);
            lessonApi.getByChapterId(selectedChapterId)
              .then(data => setLessons(data))
              .catch(err => console.error("Failed to fetch lessons:", err))
              .finally(() => setLessonsLoading(false));
          }
        } catch (error) {
          console.error("Failed to delete presentation:", error);
          message.error('Xóa slide thất bại!');
        }
      },
    });
  };

  return (
    <div>
      <Title level={2}>Thư viện bài giảng</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Khối lớp" loading={isGradesLoading}>
            <List
              dataSource={gradeList}
              renderItem={(grade) => (
                <List.Item
                  onClick={() => {
                    setSelectedGradeId(grade.id);
                    setSelectedChapterId(null);
                  }}
                  style={{ cursor: 'pointer', background: selectedGradeId === grade.id ? '#e6f7ff' : 'transparent' }}
                >
                  {grade.gradeName}
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Chương">
            {isChaptersLoading ? <Spin /> : (
              <List
                dataSource={chapters}
                renderItem={(chapter) => (
                  <List.Item
                    onClick={() => setSelectedChapterId(chapter.id)}
                    style={{ cursor: 'pointer', background: selectedChapterId === chapter.id ? '#e6f7ff' : 'transparent' }}
                  >
                    {chapter.chapterName}
                  </List.Item>
                )}
                locale={{ emptyText: selectedGradeId ? 'Không có chương nào' : 'Chọn một khối lớp' }}
              />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Bài học">
            {isLessonsLoading ? <Spin /> : (
              <List
                dataSource={lessons}
                renderItem={(lesson) => (
                  <List.Item
                    actions={lesson.presentationCount > 0 ? [
                      <Link to={`/slide-editor/${lesson.firstPresentationId}`} key="edit">
                        <Button size="small">Sửa Slide</Button>
                      </Link>,
                      <Button
                        danger
                        size="small"
                        key="delete"
                        onClick={() => handleDeletePresentation(lesson.firstPresentationId, lesson.lessonName)}
                      >
                        Xóa Slide
                      </Button>
                    ] : [
                      <Button
                        type="primary"
                        size="small"
                        key="create"
                        onClick={() => handleCreatePresentation(lesson.id, lesson.lessonName)}
                        loading={isCreating === lesson.id}
                      >
                        Tạo Slide
                      </Button>
                    ]}
                  >
                    {lesson.lessonName}
                  </List.Item>
                )}
                locale={{ emptyText: selectedChapterId ? 'Không có bài học nào' : 'Chọn một chương' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LibraryPage;