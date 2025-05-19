import { LectureStatus } from '@/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LectureDocument = HydratedDocument<Lecture>;

@Schema({ timestamps: true })
export class Lecture {
    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    courseId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdById: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    outline: string;

    @Prop()
    pptxUrl?: string;

    @Prop()
    mindmapUrl?: string;

    @Prop({ enum: LectureStatus, default: LectureStatus.DRAFT })
    status: LectureStatus;
}

export const LectureSchema = SchemaFactory.createForClass(Lecture);
