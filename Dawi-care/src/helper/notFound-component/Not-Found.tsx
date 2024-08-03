import NotFoundIcon from "./Not-found.svg"; // Assuming the image is named Not-found.svg
import NotFoundStyles from "./Not-Found.module.css"
export default function NotFound() {
  return (
    <div className={NotFoundStyles.notFoundContainer}>
      <h2>عذرًا، لم يتم العثور على البيانات المطلوبة</h2> {/* Clear and informative */}
      <img src={NotFoundIcon} alt="صفحة غير موجودة" /> {/* Descriptive alt text */}
      <p>
        نأسف لعدم العثور على ما تبحث عنه.
      </p> {/* Suggestive and helpful */}
    </div>
  );
}