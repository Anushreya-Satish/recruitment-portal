import React, { useEffect, useMemo, useState } from "react";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionnaireData } from "@/constants";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSubmissions } from "@/components/SubmissionsProvider";
import DWASFWLoader from "@/components/GDGLoader";

const normaliseQuestion = (question) =>
  typeof question === "string"
    ? { name: question, type: "generic", placeholder: "2-3 sentences" }
    : question;

const FormComp = ({ dept1, dept2, isLoading, setIsLoading }) => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isSignedIn = !!user;
  const isLoaded = !isPending;

  const [isFormOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { submittedDepartments: contextSubmitted, markDepartmentsSubmitted } =
    useSubmissions();
  const [submittedDepartments, setSubmittedDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDraftReady, setIsDraftReady] = useState(false);

  const departmentNames = useMemo(
    () =>
      [dept1, dept2]
        .filter(Boolean)
        .map((department) =>
          typeof department === "string" ? department : department.name
        ),
    [dept1, dept2]
  );

  const draftKey =
    user?.email && departmentNames.length
      ? `recruitment-draft:${user.email}:${[...departmentNames]
          .sort()
          .join("|")}`
      : null;

  // Check application limits for the active user
  useEffect(() => {
    if (user?.email) {
      checkApplicationCount(user.email);
    }
  }, [user]);

  async function checkApplicationCount(userEmail) {
    try {
      const checkResponse = await fetch(
        `/api/check-applications?email=${encodeURIComponent(userEmail)}`
      );
      const { count } = await checkResponse.json();

      if (count >= 2) {
        setErrorMessage(
          "Remember that you can only submit up to 2 unique applications."
        );
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Failed to verify application limit:", err);
    }
  }

  const normalizeDeptName = (str) =>
    str ? str.trim().toLowerCase().replace(/\s*\/\s*/g, "/") : "";

  const questionData = useMemo(
    () => [
      ...new Set(
        departmentNames.flatMap((department) =>
          (
            QuestionnaireData.find(
              (item) =>
                normalizeDeptName(item.department) ===
                normalizeDeptName(department)
            )?.questions ?? []
          )
            .map(normaliseQuestion)
            .map((question) => question.name)
        )
      ),
    ],
    [departmentNames]
  );

  const schemaObj = {
    Name: z.string().min(1, "Name is required"),
    RegistrationNumber: z
      .string()
      .min(1, "Registration number is required")
      .regex(
        /^\d{2}[A-Z]{3}\d{4}$/,
        "Registration number must be 2 numbers, 3 uppercase letters, and 4 numbers (e.g. 25BCE5612)"
      ),
    Gender: z.string().min(1, "Please select a gender"),
    Email: z.string().email(),
    Phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    "Year of Study": z.string().optional(),
    "Why do you want to join Organization Name?": z.string().optional(),
  };

  questionData.forEach((qd) => {
    schemaObj[qd] = z.string().optional();
  });

  const formSchema = z.object(schemaObj);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      RegistrationNumber: "",
      Gender: "",
      Email: "",
      Phone: "",
      "Why do you want to join Organization Name?": "",
    },
  });

  useEffect(() => {
    if (!isLoaded || !user || !draftKey) return;

    const email = user.email;
    let isActive = true;
    setIsDraftReady(false);

    try {
      const savedDraft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      form.reset({ ...form.getValues(), ...savedDraft.values, Email: email });
    } catch {
      form.setValue("Email", email);
    }

    async function initialiseForm() {
      let remoteSubmitted = contextSubmitted || [];

      if (!remoteSubmitted.length) {
        const cacheKey = `submitted_depts_${email}`;
        const cached =
          typeof window !== "undefined"
            ? sessionStorage.getItem(cacheKey)
            : null;

        if (cached) {
          try {
            remoteSubmitted = JSON.parse(cached);
          } catch {}
        } else {
          try {
            const response = await fetch(
              `/api/check-applications?email=${encodeURIComponent(email)}`
            );
            const result = await response.json();
            if (result?.submittedDepartments) {
              remoteSubmitted = result.submittedDepartments;
              if (typeof window !== "undefined") {
                sessionStorage.setItem(
                  cacheKey,
                  JSON.stringify(remoteSubmitted)
                );
              }
            }
          } catch (err) {
            console.error("Failed to check applications:", err);
          }
        }
      }

      if (!isActive) return;
      const completed = [
        ...new Set([
          ...(JSON.parse(localStorage.getItem(draftKey) || "{}")
            .submittedDepartments || []),
          ...remoteSubmitted,
        ]),
      ];
      setSubmittedDepartments(completed);

      if (
        departmentNames.length > 0 &&
        departmentNames.every((dept) => completed.includes(dept))
      ) {
        setErrorMessage(
          `You have already submitted an application for ${departmentNames.join(" and ")}.`
        );
      }

      localStorage.setItem(
        draftKey,
        JSON.stringify({
          values: form.getValues(),
          submittedDepartments: completed,
        })
      );
      setLoading(false);
      setIsDraftReady(true);
    }

    initialiseForm().catch(() => {
      if (isActive) {
        setLoading(false);
        setIsDraftReady(true);
      }
    });

    return () => {
      isActive = false;
    };
  }, [contextSubmitted, departmentNames, draftKey, form, isLoaded, user]);

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    if (!isDraftReady || !draftKey) return;
    localStorage.setItem(
      draftKey,
      JSON.stringify({ values: watchedValues, submittedDepartments })
    );
  }, [draftKey, isDraftReady, submittedDepartments, watchedValues]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <DWASFWLoader />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] p-6">
        <div className="text-center max-w-md space-y-4">
          <p className="text-2xl font-semibold text-foreground">
            Sign In Required
          </p>
          <p className="text-muted-foreground">
            Please sign in to access the application form.
          </p>
          <Button onClick={() => router.push("/auth/signin")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setErrorMessage("");

    const pendingDepartments = departmentNames.filter(
      (department) => !submittedDepartments.includes(department)
    );

    if (!pendingDepartments.length) {
      toast.success("Your applications have already been submitted.");
      setIsSubmitting(false);
      router.push("/departments");
      return;
    }

    const basicDetails = {
      Name: values.Name,
      RegistrationNumber: values.RegistrationNumber,
      Gender: values.Gender,
      Email: values.Email,
      Phone: values.Phone,
      "Year of Study": values["Year of Study"],
    };

    const submitDepartment = async (department) => {
      const questions = (
        QuestionnaireData.find((item) => item.department === department)
          ?.questions ?? []
      ).map(normaliseQuestion);

      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basicDetails,
          Department: department,
          Questions: questions.reduce(
            (answers, question) => ({
              ...answers,
              [question.name]: values[question.name] || "",
            }),
            {}
          ),
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Could not submit ${department}.`);
      }
      return { department, success: true };
    };

    try {
      const results = await Promise.allSettled(
        pendingDepartments.map(submitDepartment)
      );
      const successful = results
        .filter(
          (result) => result.status === "fulfilled" && result.value.success
        )
        .map((result) => result.value.department);
      const failed = results.flatMap((result, index) =>
        result.status === "rejected" ? [pendingDepartments[index]] : []
      );
      const completed = [
        ...new Set([...submittedDepartments, ...successful]),
      ];

      setSubmittedDepartments(completed);
      markDepartmentsSubmitted(completed);

      if (draftKey) {
        localStorage.setItem(
          draftKey,
          JSON.stringify({ values, submittedDepartments: completed })
        );
      }
      if (typeof window !== "undefined" && values?.Email) {
        sessionStorage.setItem(
          `submitted_depts_${values.Email}`,
          JSON.stringify(completed)
        );
      }

      successful.forEach((department) =>
        toast.success(`Application submitted for ${department}.`)
      );

      if (failed.length) {
        setErrorMessage(
          `Submitted ${
            successful.length ? successful.join(", ") : "no applications"
          }. Please retry ${failed.join(", ")}.`
        );
      } else {
        router.push("/departments");
      }
    } catch {
      setErrorMessage(
        "Your applications could not be submitted. Your saved answers will be kept for retrying."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-muted-foreground">Checking application status...</p>
      </div>
    );
  }

  if (!isFormOpen) {
    return (
      <div className="text-center py-20 space-y-2">
        <h2 className="text-2xl font-bold">Recruitment Closed</h2>
        <p className="text-muted-foreground">
          Recruitment has now been terminated.
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 md:p-10 bg-background rounded-xl border border-border shadow-sm my-8">
      {errorMessage && !isSubmitting && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-between gap-4">
          <p className="text-sm font-medium">{errorMessage}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/departments")}
          >
            Go Back
          </Button>
        </div>
      )}

      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Application Form</h1>
        <p className="text-muted-foreground">
          Applying to:{" "}
          <span className="font-semibold text-foreground">
            {departmentNames.join(", ")}
          </span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">About You</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Jane Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="RegistrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 25BCE5612" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly type="email" className="opacity-70" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Phone"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Phone (WhatsApp)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="10 digit phone number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="Why do you want to join Organization Name?"
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>
                    Why do you want to join Organization Name?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Share your interest in joining..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          {renderDepartmentQuestions(
            departmentNames[0],
            QuestionnaireData,
            form
          )}
          {departmentNames[1] &&
            renderDepartmentQuestions(
              departmentNames[1],
              QuestionnaireData,
              form
            )}

          <div className="pt-4 border-t flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

const renderDepartmentQuestions = (department, QuestionnaireData, form) => {
  const questions = (
    QuestionnaireData.find((qd) => qd.department === department)?.questions ??
    []
  )
    .map(normaliseQuestion)
    .filter(
      (question) =>
        question.name !== "Why do you want to join Organization Name?" &&
        question.name !== "Why do you want to join DWASFW?"
    );

  if (!questions.length) return null;

  return (
    <section className="space-y-4 pt-4">
      <h2 className="text-xl font-semibold border-b pb-2">
        {department} Questions
      </h2>
      <div className="space-y-4">
        {questions.map((question) => {
          const isCompact = question.type === "short-text";

          return (
            <FormField
              key={question.name}
              control={form.control}
              name={question.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{question.name}</FormLabel>
                  <FormControl>
                    {isCompact ? (
                      <Input
                        {...field}
                        placeholder={question.placeholder || "Answer..."}
                      />
                    ) : (
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder={
                          question.placeholder || "2-3 sentences"
                        }
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
      </div>
    </section>
  );
};

export default FormComp;