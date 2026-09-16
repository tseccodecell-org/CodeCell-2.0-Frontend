import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TemplateLoader from "./TemplateLoader";
import { updateTemplate, createTemplate } from "@/lib/api-client";
import type { TemplateResponse } from "@/lib/schemas/finale";

vi.mock("@/lib/api-client", () => ({
  listTemplates: vi.fn(),
  createTemplate: vi.fn(),
  updateTemplate: vi.fn(),
}));

vi.mock("@monaco-editor/react", () => ({
  default: ({
    value,
    onChange,
    language,
  }: {
    value: string;
    onChange: (v: string | undefined) => void;
    language: string;
  }) => (
    <textarea
      aria-label="Template code"
      data-language={language}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const mockedUpdateTemplate = updateTemplate as unknown as ReturnType<typeof vi.fn>;
const mockedCreateTemplate = createTemplate as unknown as ReturnType<typeof vi.fn>;

const cppTemplate: TemplateResponse = {
  id: "t-cpp-1",
  name: "Fast C++",
  language: "CPP",
  sourceCode: "int main(){}",
  createdAt: "2026-09-16T10:00:00Z",
  updatedAt: "2026-09-16T10:00:00Z",
};

const cppTemplate2: TemplateResponse = {
  id: "t-cpp-2",
  name: "Brute Force",
  language: "CPP",
  sourceCode: "// brute force",
  createdAt: "2026-09-16T10:00:00Z",
  updatedAt: "2026-09-16T10:00:00Z",
};

const javaTemplate: TemplateResponse = {
  id: "t-java-1",
  name: "Fast Java",
  language: "JAVA",
  sourceCode: "class Main {}",
  createdAt: "2026-09-16T10:00:00Z",
  updatedAt: "2026-09-16T10:00:00Z",
};

function typeCode(text: string) {
  const editor = screen.getByLabelText("Template code") as HTMLTextAreaElement;
  fireEvent.change(editor, { target: { value: editor.value + text } });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("TemplateLoader autosave", () => {
  it("shows Saving then Saved after a debounced edit", async () => {
    mockedUpdateTemplate.mockResolvedValue({ ...cppTemplate, sourceCode: "int main(){}// fast io" });

    render(<TemplateLoader initialTemplates={[cppTemplate]} onContinue={vi.fn()} />);

    typeCode("// fast io");
    expect(screen.getByText("Saving…")).toBeVisible();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });

    expect(mockedUpdateTemplate).toHaveBeenCalledWith(
      "t-cpp-1",
      expect.objectContaining({ name: "Fast C++", language: "CPP" })
    );
    expect(screen.getByText("Saved")).toBeVisible();
  });

  it("keeps code visible and offers retry after an autosave failure", async () => {
    mockedUpdateTemplate.mockRejectedValueOnce(new Error("offline"));

    render(<TemplateLoader initialTemplates={[cppTemplate]} onContinue={vi.fn()} />);

    typeCode("x");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });

    expect(screen.getByRole("button", { name: "Retry save" })).toBeVisible();
    expect(screen.getByLabelText("Template code")).toHaveValue("int main(){}x");
  });

  it("retries the failed save and clears the error once it succeeds", async () => {
    mockedUpdateTemplate.mockRejectedValueOnce(new Error("offline"));
    mockedUpdateTemplate.mockResolvedValueOnce({ ...cppTemplate, sourceCode: "int main(){}x" });

    render(<TemplateLoader initialTemplates={[cppTemplate]} onContinue={vi.fn()} />);

    typeCode("x");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });
    expect(screen.getByRole("button", { name: "Retry save" })).toBeVisible();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Retry save" }));
      await Promise.resolve();
    });

    expect(mockedUpdateTemplate).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Saved")).toBeVisible();
  });

  it("does not let a slow, older save response overwrite a newer save's result", async () => {
    let rejectFirst!: (e: unknown) => void;
    const firstRequest = new Promise<TemplateResponse>((_resolve, reject) => {
      rejectFirst = reject;
    });
    let resolveSecond!: (v: TemplateResponse) => void;
    const secondRequest = new Promise<TemplateResponse>((resolve) => {
      resolveSecond = resolve;
    });

    mockedUpdateTemplate.mockImplementationOnce(() => firstRequest);
    mockedUpdateTemplate.mockImplementationOnce(() => secondRequest);

    render(<TemplateLoader initialTemplates={[cppTemplate]} onContinue={vi.fn()} />);

    typeCode("v1");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });
    expect(mockedUpdateTemplate).toHaveBeenCalledTimes(1);

    typeCode("v2");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });
    expect(mockedUpdateTemplate).toHaveBeenCalledTimes(2);

    await act(async () => {
      resolveSecond({ ...cppTemplate, sourceCode: "int main(){}v1v2" });
      await Promise.resolve();
    });
    expect(screen.getByText("Saved")).toBeVisible();

    await act(async () => {
      rejectFirst(new Error("stale network error"));
      await Promise.resolve();
    });

    expect(screen.getByText("Saved")).toBeVisible();
    expect(screen.queryByRole("button", { name: "Retry save" })).not.toBeInTheDocument();
  });
});

describe("TemplateLoader language buffers", () => {
  it("selecting a template only fills its own language's buffer", async () => {
    mockedUpdateTemplate.mockResolvedValue(cppTemplate);

    const onContinue = vi.fn();
    render(
      <TemplateLoader initialTemplates={[cppTemplate, javaTemplate]} onContinue={onContinue} />
    );

    typeCode("-cpp-edit");
    expect(screen.getByLabelText("Template code")).toHaveValue("int main(){}-cpp-edit");

    fireEvent.click(screen.getByRole("button", { name: "Java" }));
    expect(screen.getByLabelText("Template code")).toHaveValue("class Main {}");

    fireEvent.click(screen.getByRole("button", { name: "C++" }));
    expect(screen.getByLabelText("Template code")).toHaveValue("int main(){}-cpp-edit");

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(onContinue).toHaveBeenCalledWith(
      { CPP: "int main(){}-cpp-edit", JAVA: "class Main {}" },
      "CPP"
    );
  });

  it("switching to a second saved template in the same language replaces only that slot", async () => {
    mockedUpdateTemplate.mockResolvedValue(cppTemplate);

    render(
      <TemplateLoader
        initialTemplates={[cppTemplate, cppTemplate2, javaTemplate]}
        onContinue={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Template code")).toHaveValue("int main(){}");

    fireEvent.click(screen.getByRole("button", { name: "Brute Force" }));
    expect(screen.getByLabelText("Template code")).toHaveValue("// brute force");

    fireEvent.click(screen.getByRole("button", { name: "Java" }));
    expect(screen.getByLabelText("Template code")).toHaveValue("class Main {}");
  });
});

describe("TemplateLoader Continue payload", () => {
  it("only reports languages the user actually touched", () => {
    const onContinue = vi.fn();
    render(<TemplateLoader initialTemplates={[cppTemplate]} onContinue={onContinue} />);

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    const [buffers, activeLanguage] = onContinue.mock.calls[0];
    expect(buffers).toEqual({ CPP: "int main(){}" });
    expect(buffers).not.toHaveProperty("JAVA");
    expect(buffers).not.toHaveProperty("PYTHON");
    expect(activeLanguage).toBe("CPP");
  });

  it("creates a new template on first save when starting from a blank slot", async () => {
    mockedCreateTemplate.mockResolvedValue({
      id: "t-new-1",
      name: "",
      language: "PYTHON",
      sourceCode: "print(1)",
      createdAt: "2026-09-16T10:00:00Z",
      updatedAt: "2026-09-16T10:00:00Z",
    });

    render(<TemplateLoader initialTemplates={[]} onContinue={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Python" }));
    typeCode("print(1)");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });

    expect(mockedCreateTemplate).toHaveBeenCalledWith(
      expect.objectContaining({ language: "PYTHON", sourceCode: "print(1)" })
    );
    expect(mockedUpdateTemplate).not.toHaveBeenCalled();
    expect(screen.getByText("Saved")).toBeVisible();
  });
});
