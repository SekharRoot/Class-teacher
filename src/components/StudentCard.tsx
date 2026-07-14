import React, { useState, useEffect } from "react";
import { Student, ClassItem } from "../types";
import { resolveStudentImage } from "../utils/imageCache";
import { StudentCardListLayout } from "./student/StudentCardListLayout";
import { StudentCardGridLayout } from "./student/StudentCardGridLayout";

interface StudentCardProps {
  item: Student;
  classes: ClassItem[];
  onViewDetails: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string, fullName: string) => void;
  readOnly?: boolean;
  selected?: boolean;
  onSelect?: (studentId: string, selected: boolean) => void;
  layout?: "grid" | "grid_compact" | "list_image" | "list_details";
}

export const StudentCard = React.memo(({
  item,
  classes,
  onViewDetails,
  onEdit,
  onDelete,
  readOnly = false,
  selected = false,
  onSelect,
  layout = "grid",
}: StudentCardProps) => {
  const fullName = `${item.firstName} ${item.lastName}`;
  const [displayImage, setDisplayImage] = useState<string>("");

  useEffect(() => {
    resolveStudentImage(item).then(setDisplayImage);
  }, [item]);

  const getClassNameFromId = (classId?: string) => {
    if (!classId) return "No Class Assigned";
    const foundClass = classes.find((c) => c.id === classId);
    return foundClass
      ? `${foundClass.board} ${foundClass.classStandard} ${foundClass.section}`
      : "No Class Assigned";
  };

  const className = getClassNameFromId(item.classId);
  const isCompact = layout === "grid_compact";
  const isList = layout === "list_image" || layout === "list_details";

  if (isList) {
    return (
      <StudentCardListLayout
        item={item}
        fullName={fullName}
        displayImage={displayImage}
        className={className}
        layout={layout as "list_image" | "list_details"}
        readOnly={readOnly}
        selected={selected}
        onSelect={onSelect}
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return (
    <StudentCardGridLayout
      item={item}
      fullName={fullName}
      displayImage={displayImage}
      className={className}
      isCompact={isCompact}
      readOnly={readOnly}
      selected={selected}
      onSelect={onSelect}
      onViewDetails={onViewDetails}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
});
