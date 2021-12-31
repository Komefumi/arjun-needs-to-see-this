import { useState, ChangeEvent } from "react";
import axios from "axios";

enum AlertVariant {
  INFO = "info",
  ERROR = "error",
  SUCCESS = "success",
}

const alertMessageForVariant = {
  [AlertVariant.INFO]:
  "<p>Use this to notify me (Arjun). You don't have to provide any details, but you optionally can if you want me to reach back to you.</p> <p>Basically, you're able to notify me of anything urgent.</p>",
  [AlertVariant.ERROR]:
    "Uh, oh. Something went wrong. Might want to refresh and try again later. Or report a problem, and it'll hopefully get fixed-",
  [AlertVariant.SUCCESS]: "Successfully posted message",
};

function App() {
  const [isSending, setIsSending] = useState<Boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<AlertVariant>(
    AlertVariant.INFO
  );

  const generateChangeHandler = (valueSetter: (val: string) => void) => {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      valueSetter(event.target.value);
    };
  };

  const submitMessage = async () => {
    setIsSending(true);
    try {
      await axios.post("https://peaceful-hollows-79154.herokuapp.com/message", {
        title,
        content,
      });
      setTitle("");
      setContent("");
      setAlertVariant(AlertVariant.SUCCESS);
    } catch (error) {
      setAlertVariant(AlertVariant.ERROR);
    } finally {
      setIsSending(false);
    }
  };

  const isValid: boolean = title.length && content.length ? true : false;

  return (
    <div>
      <div className="container entirety">
        <div className="alerts">
          <div className={`alert alert-${alertVariant}`} dangerouslySetInnerHTML={{ __html: alertMessageForVariant[alertVariant] }} role="alert" />
        </div>

        <div className="form">
          {isSending && (
            <div className="d-flex loading-section">
              <div className="ms-auto spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Title of Message"
              onChange={generateChangeHandler(setTitle)}
              value={title}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              className="form-control content-writer"
              rows={5}
              onChange={generateChangeHandler(setContent)}
              value={content}
            ></textarea>
          </div>
          <div className="d-grid">
            <button
              className="btn btn-dark"
              type="button"
              // @ts-ignore
              disabled={!isValid || isSending}
              onClick={submitMessage}
            >
              Submit Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
