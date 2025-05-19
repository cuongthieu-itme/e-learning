import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CourseTopicDocument = HydratedDocument<CourseTopic>;

@Schema()
export class CourseTopic {
    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    courseId: Types.ObjectId;

    @Prop({ required: true })
    topic: string;
}

export const CourseTopicSchema = SchemaFactory.createForClass(CourseTopic);

CourseTopicSchema.index({ courseId: 1, topic: 1 }, { unique: true });
