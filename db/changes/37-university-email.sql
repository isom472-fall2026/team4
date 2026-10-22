-- Story #37: Sign up with a university email
-- Changes handle_new_user to enforce university email domain (@ku.edu.kw and subdomains)
-- and check for existing student_id and email before insert.

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  -- Restrict sign-up to Kuwait University domain (@ku.edu.kw and subdomains)
  if new.email !~* '^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)*ku\.edu\.kw$' then
    raise exception 'Registration is restricted to university email addresses (@ku.edu.kw).';
  end if;

  if exists (select 1 from public.profiles where student_id = (new.raw_user_meta_data ->> 'student_id')) then
    raise exception 'This student ID is already registered.';
  end if;

  if exists (select 1 from public.profiles where email = new.email) then
    raise exception 'This email is already registered.';
  end if;

  insert into public.profiles (id, full_name, student_id, email)
  values (new.id,
          new.raw_user_meta_data ->> 'full_name',
          new.raw_user_meta_data ->> 'student_id',
          new.email);
  return new;
end;
$$;
