import { ConfirmEmailBanner } from "@/components/confirm-email-banner";
import { getSessionContext } from "@/lib/session-context";

export default async function ListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionContext();
  const showBanner = session?.isStaffUser && session.emailConfirmed === false;

  return (
    <>
      {showBanner && session ? (
        <div className="px-4 pt-6 sm:px-6 lg:px-8">
          <ConfirmEmailBanner email={session.email} />
        </div>
      ) : null}
      {children}
    </>
  );
}
